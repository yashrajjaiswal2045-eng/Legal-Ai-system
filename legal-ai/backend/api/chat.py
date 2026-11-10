from fastapi import APIRouter, HTTPException

from models.schemas import ChatRequest, ChatResponse
from services import legal_service

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse, summary="Ask a legal question")
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    return await legal_service.handle_chat(req.message, req.jurisdiction, req.state, req.conversation_id, req.domain)
