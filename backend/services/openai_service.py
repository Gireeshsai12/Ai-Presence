from openai import OpenAI
from config.settings import get_settings

settings = get_settings()

class AIService:
    def __init__(self):
        self.enabled = bool(settings.openai_api_key)
        self.client = OpenAI(api_key=settings.openai_api_key) if self.enabled else None

    def reply(self, system_prompt: str, messages: list[dict], user_text: str) -> str:
        if not self.enabled:
            return self._fallback_reply(user_text)

        formatted = [{"role": "system", "content": system_prompt}]
        for msg in messages[-12:]:
            role = "user" if msg.get("sender") == "You" else "assistant"
            formatted.append({"role": role, "content": msg.get("text", "")})
        formatted.append({"role": "user", "content": user_text})

        response = self.client.chat.completions.create(
            model=settings.openai_model,
            messages=formatted,
            temperature=0.7,
        )
        return response.choices[0].message.content or "I could not generate a response."

    def _fallback_reply(self, user_text: str) -> str:
        lower = user_text.lower()
        if "resume" in lower:
            return "Paste your resume and I’ll review it for ATS keywords, bullet strength, missing skills, and improvements."
        if "job" in lower or "jd" in lower:
            return "Paste the job description and I’ll extract required skills, missing keywords, and a learning plan."
        if "star" in lower:
            return "Send your behavioral answer and I’ll score it by Situation, Task, Action, and Result."
        return "Great. Let’s practice like a real interview. Tell me about yourself in 60–90 seconds."
