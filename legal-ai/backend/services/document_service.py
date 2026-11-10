"""Builds draft letters, saves them, and exports DOCX / PDF files."""
import uuid
from datetime import date, datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape

from docx import Document
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from services import store
from services.legal_service import DISCLAIMER, amount_to_number, detect_risk

BASE_DIR = Path(__file__).resolve().parent.parent
OUT_DIR = BASE_DIR / "generated_documents"
UPLOAD_DIR = BASE_DIR / "uploads"
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_UPLOADS = {".pdf", ".docx", ".txt"}
BLANK = "[to be filled in]"
DRAFT_BANNER = "DRAFT. Not legal advice and not verified. Review it carefully before using it."


class DocumentError(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message, self.status_code = message, status_code


# One entry per document type: title, who it is addressed to, subject line, closing request.
TYPES = {
    "consumer_complaint": ("Consumer Complaint", "The consumer commission or forum with jurisdiction over {place} [confirm the correct forum before filing]",
        "Complaint about a product or service", "I request that this matter be examined and appropriate relief be granted, such as a refund, replacement or compensation [edit as needed]."),
    "legal_notice": ("Legal Notice", "{opposite}", "Notice regarding the matter described below",
        "You are requested to resolve this matter within 15 days of receiving this notice [edit the period as needed]. Otherwise I may consider further steps."),
    "rental_letter": ("Rental Letter", "{opposite}", "Letter regarding a rental matter",
        "I request that you resolve this within 15 days [edit as needed] and confirm your response in writing."),
    "employment_letter": ("Employment Letter", "{opposite}", "Letter regarding an employment matter",
        "I request a written response within 15 days [edit as needed]."),
    "rti_application": ("RTI Application", "The Public Information Officer, {opposite}", "Application for information under {rti_law}",
        "Please provide the information described above. [Check the prescribed fee and format with the authority.]"),
    "general_application": ("General Application", "{opposite}", "Application regarding the matter below",
        "I request that you kindly consider this application and take appropriate action."),
    "agreement_template": ("Agreement Template", "", "", ""),
}


def _fact(facts, *keys):
    """First non-empty value among several possible key names (frontend and spec use different names)."""
    for k in keys:
        if str(facts.get(k) or "").strip():
            return str(facts[k]).strip()
    return ""


def validate_draft_request(document_type, facts):
    if document_type not in TYPES:
        raise DocumentError(f"Unsupported document type '{document_type}'. Supported: {', '.join(TYPES)}")
    if not _fact(facts, "name"):
        raise DocumentError("Missing required field: facts.name")
    if not _fact(facts, "issue", "incident"):
        raise DocumentError("Missing required field: facts.issue")


def build_draft(document_type, jurisdiction, state, facts):
    title, recipient, subject, ask = TYPES[document_type]
    name, address = _fact(facts, "name") or BLANK, _fact(facts, "address") or BLANK
    issue, extra = _fact(facts, "issue", "incident"), _fact(facts, "additional_facts", "facts")
    amount, when = _fact(facts, "amount"), _fact(facts, "date") or date.today().isoformat()
    opposite = _fact(facts, "opposite", "opposite_party") or "[Name of the opposite party / authority]"
    place = f"{state}, {jurisdiction}" if state else jurisdiction
    rti_law = "the Right to Information Act, 2005" if jurisdiction.lower() == "india" else "the applicable right-to-information law"

    if document_type == "agreement_template":
        body = (f"AGREEMENT TEMPLATE\n\nThis agreement is made on {when} between {name}, residing at {address} (First Party) "
                f"and {opposite} (Second Party).\n\nPurpose: {issue}\n\n"
                + (f"Amount: Rs. {amount}\n\n" if amount else "")
                + "1. Terms and duration: [to be filled in]\n2. Payment terms: [to be filled in]\n"
                  "3. Responsibilities of each party: [to be filled in]\n4. Ending the agreement: [to be filled in]\n"
                  "5. Dispute resolution: [to be filled in]\n\n"
                + (f"Additional facts: {extra}\n\n" if extra else "")
                + f"Signed by:\n{name} ____________    {opposite} ____________")
    else:
        to = recipient.format(place=place, opposite=opposite)
        body = (f"Date: {when}\n\nTo,\n{to}\n\nSubject: {subject.format(rti_law=rti_law)}\n\nDear Sir/Madam,\n\n"
                f"I, {name}, residing at {address}, am writing about the following matter.\n\n{issue}\n\n"
                + (f"Additional facts: {extra}\n\n" if extra else "")
                + (f"Amount involved: Rs. {amount}\n\n" if amount else "")
                + f"{ask}\n\nYours faithfully,\n{name}\n{address}")
    return title, f"{DRAFT_BANNER}\n\n{body}"


def create_document(document_type, jurisdiction, state, facts):
    validate_draft_request(document_type, facts)
    title, content = build_draft(document_type, jurisdiction, state, facts)
    risk = detect_risk(_fact(facts, "issue", "incident") + " " + _fact(facts, "additional_facts", "facts"),
                       amount_to_number(_fact(facts, "amount")))
    doc = {
        "document_id": uuid.uuid4().hex[:12], "title": title, "document_type": document_type, "content": content,
        "jurisdiction": jurisdiction, "state": state, "facts": facts, "risk_level": risk["level"],
        "requires_human_review": risk["level"] == "high",
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }
    store.DOCUMENTS[doc["document_id"]] = doc
    if doc["requires_human_review"]:  # high-risk drafts automatically go to the review queue
        store.REVIEWS[doc["document_id"]] = review_from_document(doc, risk["reasons"])
    return doc


def review_from_document(doc, reasons=None):
    return {
        "document_id": doc["document_id"], "title": doc["title"], "risk_level": doc["risk_level"],
        "requires_human_review": True, "jurisdiction": ", ".join(x for x in [doc.get("state"), doc["jurisdiction"]] if x),
        "date": doc["created_at"][:10], "status": "Pending",
        "question": str(doc["facts"].get("issue") or doc["facts"].get("incident") or ""),
        "facts": [f"{k}: {v}" for k, v in doc["facts"].items() if str(v).strip()],
        "reasoning": "Flagged by keyword rules: " + (", ".join(reasons) if reasons else "manual request") + ". Needs lawyer review.",
        "draft": doc["content"], "sources": [],
    }


def get_document(document_id):
    doc = store.DOCUMENTS.get(document_id)
    if not doc:
        raise DocumentError("Document not found", 404)
    return doc


# ---------- Export ----------
def generate_docx(doc):
    d = Document()
    d.add_heading(doc["title"], level=0)
    d.add_paragraph(f"Date: {doc['created_at'][:10]}")
    d.add_heading("Information provided", level=1)
    for k, v in doc["facts"].items():
        if str(v).strip():
            p = d.add_paragraph()
            p.add_run(f"{k.replace('_', ' ').title()}: ").bold = True
            p.add_run(str(v))
    d.add_heading("Draft content", level=1)
    for block in doc["content"].split("\n\n"):
        d.add_paragraph(block)
    d.add_paragraph().add_run(DISCLAIMER).italic = True
    path = OUT_DIR / f"{doc['document_id']}.docx"
    d.save(path)
    return path


def generate_pdf(doc):
    styles = getSampleStyleSheet()
    para = lambda text, style="BodyText": Paragraph(escape(text).replace("\n", "<br/>"), styles[style])
    story = [para(doc["title"], "Title"), para(f"Date: {doc['created_at'][:10]}"), Spacer(1, 12)]
    story += [x for block in doc["content"].split("\n\n") for x in (para(block), Spacer(1, 8))]
    story.append(para(DISCLAIMER, "Italic"))
    path = OUT_DIR / f"{doc['document_id']}.pdf"
    SimpleDocTemplate(str(path), pagesize=A4, title=doc["title"]).build(story)
    return path


# ---------- Upload ----------
def save_upload(filename, data):
    """Basic safety checks, then save under a random name (never trust the user's file name)."""
    ext = Path(filename or "").suffix.lower()
    if ext not in ALLOWED_UPLOADS:
        raise DocumentError("Unsupported file type. Allowed: PDF, DOCX, TXT")
    if not data:
        raise DocumentError("The uploaded file is empty")
    if len(data) > MAX_UPLOAD_BYTES:
        raise DocumentError("File is too large (maximum 10 MB)", 413)
    looks_ok = {".pdf": data.startswith(b"%PDF"), ".docx": data.startswith(b"PK"), ".txt": b"\x00" not in data}[ext]
    if not looks_ok:
        raise DocumentError(f"The file content does not look like a valid {ext[1:].upper()} file")
    doc_id = uuid.uuid4().hex[:12]
    (UPLOAD_DIR / f"{doc_id}{ext}").write_bytes(data)
    meta = {"document_id": doc_id, "filename": Path(filename).name, "status": "uploaded", "size_bytes": len(data)}
    store.UPLOADS[doc_id] = meta
    return meta
