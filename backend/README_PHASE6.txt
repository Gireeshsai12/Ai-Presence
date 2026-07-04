AI Presence Phase 6 — AI Intelligence Upgrade

Copy:
Extract ZIP -> copy backend folder contents -> paste into E:\ai-presence\backend -> Replace all

Run:
cd E:\ai-presence\backend
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Phase 6 upgrades:
- Smarter resume scoring
- Resume profile extraction
- JD matching with roadmap
- STAR evaluator
- Communication analyzer
- Coding evaluator
- Interview evaluator
- Memory extraction from chat
- WebSocket now updates memory
- Optional OpenAI integration if OPENAI_API_KEY is in .env

Test:
http://127.0.0.1:8000/docs
