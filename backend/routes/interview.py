from fastapi import APIRouter
from schemas.career import InterviewAnswerRequest, InterviewStartRequest
from services.interview_service import evaluate_interview_answer, start_interview

router = APIRouter()


@router.post("/start")
def start(payload: InterviewStartRequest):
    return start_interview(payload.role, payload.difficulty, payload.interview_type)


@router.post("/evaluate-answer")
def evaluate(payload: InterviewAnswerRequest):
    return evaluate_interview_answer(payload.question, payload.answer, payload.role)
