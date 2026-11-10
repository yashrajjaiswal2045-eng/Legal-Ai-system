from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from models.schemas import ContentUpdate, DocumentDetail, DocumentSummary, DraftRequest, DraftResponse, UploadResponse
from services import document_service as ds
from services import store
from services.legal_service import DISCLAIMER

router = APIRouter(prefix="/documents", tags=["Documents"])


def _call(fn, *args):
    """Turn our DocumentError into a proper HTTP error with a JSON {"detail": ...} body."""
    try:
        return fn(*args)
    except ds.DocumentError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/draft", response_model=DraftResponse, summary="Generate a draft document")
def create_draft(req: DraftRequest):
    doc = _call(ds.create_document, req.document_type, req.jurisdiction, req.state, req.facts)
    return {**doc, "is_draft": True, "disclaimer": DISCLAIMER}


@router.post("/upload", response_model=UploadResponse, summary="Upload a PDF, DOCX or TXT file")
async def upload(file: UploadFile = File(...)):
    data = await file.read()
    return _call(ds.save_upload, file.filename, data)


@router.get("", response_model=List[DocumentSummary], summary="List generated documents")
def list_documents():
    return sorted(store.DOCUMENTS.values(), key=lambda d: d["created_at"], reverse=True)


@router.get("/{document_id}", response_model=DocumentDetail, summary="Get one generated document")
def get_document(document_id: str):
    return _call(ds.get_document, document_id)


@router.put("/{document_id}", response_model=DocumentDetail, summary="Save edited draft text")
def update_document(document_id: str, body: ContentUpdate):
    doc = _call(ds.get_document, document_id)
    doc["content"] = body.content
    return doc


@router.get("/{document_id}/download/docx", summary="Download the draft as DOCX")
def download_docx(document_id: str):
    doc = _call(ds.get_document, document_id)
    path = ds.generate_docx(doc)
    return FileResponse(path, filename=f"{doc['document_type']}.docx",
                        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")


@router.get("/{document_id}/download/pdf", summary="Download the draft as PDF")
def download_pdf(document_id: str):
    doc = _call(ds.get_document, document_id)
    path = ds.generate_pdf(doc)
    return FileResponse(path, filename=f"{doc['document_type']}.pdf", media_type="application/pdf")
