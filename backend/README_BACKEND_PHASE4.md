# AI Presence Backend Phase 4 - ZIP 3 to ZIP 8 Complete Pack

This backend pack includes:

- Authentication foundation
- SQLite persistence
- WebSocket chat
- AI fallback service with optional OpenAI
- Memory service
- Resume review
- Resume upload parsing
- JD analyzer
- STAR evaluator
- Coding evaluator
- Interview engine
- Deployment-ready env structure

## Run

```powershell
cd E:\ai-presence\backend
.\venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

## Test

- http://127.0.0.1:8000/
- http://127.0.0.1:8000/api/health
- http://127.0.0.1:8000/docs
