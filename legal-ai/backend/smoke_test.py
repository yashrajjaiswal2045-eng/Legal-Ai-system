"""Run AFTER starting the server:  python smoke_test.py
Checks every endpoint the project needs and prints PASS / FAIL."""
import sys

import httpx

BASE = "http://127.0.0.1:8000/api"
failures = 0


def check(name, ok, extra=""):
    global failures
    failures += 0 if ok else 1
    print(("PASS  " if ok else "FAIL  ") + name + (f"  {extra}" if extra and not ok else ""))


c = httpx.Client(timeout=90)
r = c.get(f"{BASE}/health")
check("GET /health", r.status_code == 200 and r.json()["status"] == "ok", r.text)

r = c.post(f"{BASE}/chat", json={"message": "My landlord has not returned my security deposit.", "jurisdiction": "India", "state": "West Bengal"})
check("POST /chat normal question", r.status_code == 200 and r.json()["risk_level"] in ("low", "medium") and r.json()["sources"] == [], r.text)

r = c.post(f"{BASE}/chat", json={"message": "I have an FIR against me", "jurisdiction": "India"})
check("POST /chat high-risk (FIR)", r.status_code == 200 and r.json()["risk_level"] == "high" and r.json()["requires_human_review"], r.text)

facts = {"name": "Asha Roy", "address": "12 Park Street, Kolkata", "issue": "Defective refrigerator not replaced", "date": "2026-10-01", "amount": "42000"}
r = c.post(f"{BASE}/documents/draft", json={"document_type": "consumer_complaint", "jurisdiction": "India", "state": "West Bengal", "facts": facts})
check("POST /documents/draft", r.status_code == 200 and "DRAFT" in r.json()["content"], r.text)
doc_id = r.json().get("document_id", "missing")

r = c.post(f"{BASE}/documents/draft", json={"document_type": "bad_type", "facts": facts})
check("POST /documents/draft unsupported type -> 400", r.status_code == 400, r.text)

r = c.get(f"{BASE}/documents")
check("GET /documents", r.status_code == 200 and any(d["document_id"] == doc_id for d in r.json()), r.text)

r = c.get(f"{BASE}/documents/{doc_id}/download/docx")
check("GET download DOCX", r.status_code == 200 and r.content[:2] == b"PK", str(r.status_code))
r = c.get(f"{BASE}/documents/{doc_id}/download/pdf")
check("GET download PDF", r.status_code == 200 and r.content[:4] == b"%PDF", str(r.status_code))
check("GET download unknown id -> 404", c.get(f"{BASE}/documents/nope/download/pdf").status_code == 404)

r = c.post(f"{BASE}/documents/upload", files={"file": ("agreement.txt", b"Sample agreement text", "text/plain")})
check("POST /documents/upload TXT", r.status_code == 200 and r.json()["status"] == "uploaded", r.text)
r = c.post(f"{BASE}/documents/upload", files={"file": ("virus.exe", b"MZ", "application/octet-stream")})
check("POST /documents/upload bad type -> 400", r.status_code == 400, r.text)

for action in ("approve", "reject", "escalate"):
    r = c.post(f"{BASE}/review/{doc_id}/{action}")
    check(f"POST /review/{{id}}/{action}", r.status_code == 200, r.text)
r = c.post(f"{BASE}/review/{doc_id}/edit", json={"content": "Edited draft text"})
check("POST /review/{id}/edit", r.status_code == 200, r.text)
check("GET /review", c.get(f"{BASE}/review").status_code == 200)

print("\nAll checks passed." if not failures else f"\n{failures} check(s) failed.")
sys.exit(1 if failures else 0)
