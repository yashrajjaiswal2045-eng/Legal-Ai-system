"""Legal.AI backend entry point. Run with:  uvicorn main:app --reload"""
import os

from dotenv import load_dotenv

load_dotenv()  # read .env before anything else uses os.getenv

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from api.routes import api_router

app = FastAPI(
    title="Legal.AI backend",
    description="Informational legal guidance and draft assistance. Not legal representation.",
    version="0.1.0",
)

# CORS: only the Vite dev server may call this API from a browser.
origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()] or [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", include_in_schema=False)
def root():
    return {"service": "Legal.AI backend", "docs": "/docs"}


@app.exception_handler(Exception)
async def unexpected_error(request: Request, exc: Exception):
    # Last safety net: always answer with JSON {"detail": ...} instead of crashing.
    return JSONResponse(status_code=500, content={"detail": "Unexpected server error. Please try again."})
