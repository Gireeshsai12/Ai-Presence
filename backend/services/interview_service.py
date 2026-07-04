from services.career_service import evaluate_star
from services.text_utils import TECH_KEYWORDS, keyword_hits

QUESTION_BANK = {
    "behavioral": ["Tell me about yourself.", "Describe a challenging project.", "Tell me about a time you learned quickly.", "Why do you want this role?"],
    "technical": ["Explain REST APIs.", "Explain SQL joins.", "How would you design authentication?", "Explain React state and props."],
    "coding": ["Two Sum.", "Reverse a linked list.", "Check palindrome.", "Merge sorted arrays."],
}


def start_interview(role: str, difficulty: str, interview_type: str) -> dict:
    questions = QUESTION_BANK.get(interview_type, QUESTION_BANK["behavioral"])
    return {"role": role, "difficulty": difficulty, "interview_type": interview_type, "questions": questions, "first_question": questions[0], "instructions": "Answer naturally and use examples."}


def evaluate_interview_answer(question: str, answer: str, role: str) -> dict:
    star = evaluate_star(question, answer)
    tech_hits = keyword_hits(answer, TECH_KEYWORDS)
    technical_depth = min(100, 45 + len(tech_hits) * 8)
    clarity = 80 - (20 if len(answer.split()) < 35 else 0)
    score = int(star["overall_score"] * 0.55 + technical_depth * 0.25 + clarity * 0.20)
    return {"question": question, "role": role, "score": max(0, min(100, score)), "star_breakdown": star["scores"], "technical_keywords_used": tech_hits, "technical_depth_score": technical_depth, "clarity_score": clarity, "feedback": ["Use STAR.", "Add technical keywords naturally.", "End with measurable impact."]}
