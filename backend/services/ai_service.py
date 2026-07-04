from config.settings import get_settings

settings = get_settings()

SYSTEM_PROMPTS = {
    "interview_coach": "You are a direct but supportive software engineering interview coach.",
    "study_mentor": "You are a calm study mentor. Explain step by step.",
    "focus_partner": "You help the user focus and take the next action.",
    "resume_reviewer": "You are an ATS resume reviewer.",
    "jd_analyzer": "You analyze job descriptions.",
    "coding_coach": "You coach coding interviews.",
    "communication_coach": "You coach clarity and confidence.",
}


async def generate_ai_reply(text: str, mode: str = "interview_coach", memory: dict | None = None) -> str:
    if settings.openai_api_key:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            response = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["interview_coach"])}, {"role": "user", "content": text}],
                temperature=0.65,
            )
            return response.choices[0].message.content or fallback_reply(text, mode)
        except Exception as exc:
            return f"{fallback_reply(text, mode)}\n\n_Local fallback used: {type(exc).__name__}._"
    return fallback_reply(text, mode)


def fallback_reply(text: str, mode: str) -> str:
    if mode == "resume_reviewer":
        return "Paste or upload your resume in the Resume Reviewer panel and I will score ATS strength, keywords, structure, and missing skills."
    if mode == "jd_analyzer":
        return "Paste the job description in the JD Analyzer panel and I will extract required skills, matched skills, missing skills, and a roadmap."
    if mode == "coding_coach":
        return "Share the coding question and solution, and I will review correctness, edge cases, and complexity."
    return f"Good. Let's improve this with one clear example and measurable impact. Your message: {text[:180]}"
