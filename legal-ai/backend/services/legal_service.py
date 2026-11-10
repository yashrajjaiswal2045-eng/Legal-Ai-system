"""Chat logic: risk detection + deciding whether to call the LLM."""
import re
import uuid

from services import store
from services.llm_service import LLMError, generate_response

DISCLAIMER = "Legal.AI provides informational guidance and draft assistance, not legal representation."
SOURCES_NOTE = "Sources are not available yet. Source retrieval will be added in a later version."

# \b means "word boundary", so "fir" does not match the word "first".
HIGH_RISK = [
    r"\bfir\b", r"\bpolice\b", r"\barrest", r"criminal", r"\bcourt\b", r"imprison", r"\bcustody\b",
    r"domestic violence", r"sexual assault", r"\brape\b", r"\bdeath\b", r"\bmurder", r"\bthreat",
    r"\burgent", r"\blakhs?\b", r"\bcrores?\b", r"\bmillion\b",
]
MEDIUM_RISK = [
    r"deposit", r"salary", r"wages", r"refund", r"evict", r"terminat", r"dismiss", r"\bnotice\b",
    r"contract", r"agreement", r"dispute", r"loan", r"cheque", r"harass",
]

HIGH_RISK_ANSWER = (
    "This appears to involve a potentially high-risk legal matter. Legal.AI can provide general "
    "information, but this situation should be reviewed by a qualified legal professional. "
    "If anyone is in immediate danger, contact your local emergency services first."
)


def amount_to_number(text):
    """'Rs. 2,50,000' -> 250000. Returns 0 if no number is found."""
    digits = re.sub(r"[^\d]", "", str(text or ""))
    return int(digits) if digits else 0


def detect_risk(text, amount=0):
    """Return {"level": "low|medium|high", "reasons": [...]} using simple keyword rules."""
    t = (text or "").lower()
    reasons = [p for p in HIGH_RISK if re.search(p, t)]
    # Currency amounts written like "Rs. 2500000" or "$1,000,000" count as large money disputes.
    for m in re.findall(r"(?:rs\.?|inr|₹|\$)\s*(\d[\d,]*)", t):
        amount = max(amount, amount_to_number(m))
    if amount >= 1_000_000:
        reasons.append("large financial amount")
    if reasons:
        return {"level": "high", "reasons": reasons}
    if amount >= 100_000 or any(re.search(p, t) for p in MEDIUM_RISK):
        return {"level": "medium", "reasons": ["money or contract dispute"]}
    return {"level": "low", "reasons": []}


async def handle_chat(message, jurisdiction, state, conversation_id=None, domain=None):
    conv_id = conversation_id or uuid.uuid4().hex[:12]
    history = store.CONVERSATIONS.setdefault(conv_id, [])
    risk = detect_risk(message)["level"]

    if risk == "high":  # do not send to the LLM; give a safe response
        answer, mode = HIGH_RISK_ANSWER, "safety"
    else:
        text = f"(Legal area: {domain}) {message}" if domain else message
        try:
            answer, mode = await generate_response(text, jurisdiction, state, history[-6:])
        except LLMError as e:
            answer = f"The AI service is unavailable right now ({e}). Please try again in a moment."
            mode = "fallback"

    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": answer})
    return {
        "answer": answer, "risk_level": risk, "sources": [], "sources_note": SOURCES_NOTE,
        "disclaimer": DISCLAIMER, "requires_human_review": risk == "high",
        "conversation_id": conv_id, "mode": mode,
    }
