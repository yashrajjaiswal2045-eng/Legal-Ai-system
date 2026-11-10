# Legal.AI backend (FastAPI)
Windows:  python -m venv venv  then  venv\Scripts\activate  then  pip install -r requirements.txt  then  uvicorn main:app --reload
macOS/Linux: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload
Docs: http://127.0.0.1:8000/docs     Smoke test (second terminal): python smoke_test.py
Leave LLM_API_KEY empty in .env for demo mode.
