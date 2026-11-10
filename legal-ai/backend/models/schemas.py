"""Pydantic models = the shape of every request and response (also drives /docs)."""
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Source(BaseModel):
    title: str
    url: str
    source_type: str = "official"


# ---------- Chat ----------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, examples=["My landlord has not returned my security deposit."])
    jurisdiction: str = "India"
    state: Optional[str] = None
    domain: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    risk_level: str  # "low" | "medium" | "high"
    sources: List[Source] = []
    sources_note: str
    disclaimer: str
    requires_human_review: bool
    conversation_id: str
    mode: str  # "llm" | "demo" | "fallback" | "safety"


# ---------- Documents ----------
class DraftRequest(BaseModel):
    document_type: str = Field(..., examples=["consumer_complaint"])
    jurisdiction: str = "India"
    state: Optional[str] = None
    facts: Dict[str, Any] = {}


class DraftResponse(BaseModel):
    document_id: str
    title: str
    content: str
    risk_level: str
    requires_human_review: bool
    is_draft: bool = True
    disclaimer: str


class DocumentSummary(BaseModel):
    document_id: str
    title: str
    document_type: str
    created_at: str
    risk_level: str


class DocumentDetail(DocumentSummary):
    content: str
    jurisdiction: str
    state: Optional[str] = None
    facts: Dict[str, Any] = {}
    requires_human_review: bool


class ContentUpdate(BaseModel):
    content: str = Field(..., min_length=1)


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    status: str
    size_bytes: int


# ---------- Review ----------
class ReviewItem(BaseModel):
    document_id: str
    title: str
    risk_level: str
    requires_human_review: bool = True
    jurisdiction: str
    date: str
    status: str
    question: str
    facts: List[str] = []
    reasoning: str
    draft: str
    sources: List[Source] = []


class ReviewCreate(BaseModel):
    question: str = Field(..., min_length=1)
    title: Optional[str] = None
    document_id: Optional[str] = None
    jurisdiction: str = "India"


class ReviewEdit(BaseModel):
    content: str = Field(..., min_length=1)


class ReviewAction(BaseModel):
    document_id: str
    status: str
    message: str
