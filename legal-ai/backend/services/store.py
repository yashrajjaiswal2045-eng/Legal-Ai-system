"""Simple in-memory storage. Data is lost when the server restarts.
Replace these dicts with a real database later (e.g. PostgreSQL)."""
DOCUMENTS = {}      # document_id -> dict
REVIEWS = {}        # document_id -> dict
CONVERSATIONS = {}  # conversation_id -> list of {"role", "content"}
UPLOADS = {}        # document_id -> dict (metadata only)
