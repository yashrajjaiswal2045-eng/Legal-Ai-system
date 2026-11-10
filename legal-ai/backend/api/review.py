import uuid
from datetime import date
from typing import List

from fastapi import APIRouter, HTTPException

from models.schemas import ReviewAction, ReviewCreate, ReviewEdit, ReviewItem
from services import document_service as ds
from services import store
from services.legal_service import detect_risk

router = APIRouter(prefix="/review", tags=["Human review"])


def _find(document_id):
    """Find a review case. A generated draft with no case yet is added to the queue on demand."""
    item = store.REVIEWS.get(document_id)
    if not item and document_id in store.DOCUMENTS:
        item = store.REVIEWS[document_id] = ds.review_from_document(store.DOCUMENTS[document_id])
    if not item:
        raise HTTPException(status_code=404, detail="Review case not found")
    return item


@router.get("", response_model=List[ReviewItem], summary="List review cases")
def list_reviews():
    return list(store.REVIEWS.values())


@router.post("", response_model=ReviewItem, summary="Send a question for human review")
def submit_for_review(body: ReviewCreate):
    risk = detect_risk(body.question)
    doc_id = body.document_id or uuid.uuid4().hex[:12]
    item = {
        "document_id": doc_id, "title": body.title or body.question[:60], "risk_level": risk["level"],
        "requires_human_review": True, "jurisdiction": body.jurisdiction, "date": date.today().isoformat(),
        "status": "Pending", "question": body.question, "facts": [],
        "reasoning": "Sent for review by the user. " + ("Flagged: " + ", ".join(risk["reasons"]) if risk["reasons"] else ""),
        "draft": "", "sources": [],
    }
    store.REVIEWS[doc_id] = item
    return item


def _set_status(document_id, status):
    item = _find(document_id)
    item["status"] = status
    return {"document_id": document_id, "status": status, "message": f"Case marked as {status.lower()}."}


@router.post("/{document_id}/approve", response_model=ReviewAction, summary="Approve a case")
def approve(document_id: str):
    return _set_status(document_id, "Approved")


@router.post("/{document_id}/reject", response_model=ReviewAction, summary="Reject a case")
def reject(document_id: str):
    return _set_status(document_id, "Rejected")


@router.post("/{document_id}/escalate", response_model=ReviewAction, summary="Escalate a case")
def escalate(document_id: str):
    return _set_status(document_id, "Escalated")


@router.post("/{document_id}/edit", response_model=ReviewAction, summary="Edit the draft of a case")
def edit(document_id: str, body: ReviewEdit):
    item = _find(document_id)
    item["draft"] = body.content
    if document_id in store.DOCUMENTS:
        store.DOCUMENTS[document_id]["content"] = body.content
    return _set_status(document_id, "Edited")
