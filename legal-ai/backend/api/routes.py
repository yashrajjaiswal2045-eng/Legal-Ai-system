from fastapi import APIRouter

from api import chat, documents, review

api_router = APIRouter(prefix="/api")


@api_router.get("/health", tags=["Health"], summary="Health check")
def health():
    return {"status": "ok", "service": "Legal.AI backend"}


api_router.include_router(chat.router)
api_router.include_router(documents.router)
api_router.include_router(review.router)
