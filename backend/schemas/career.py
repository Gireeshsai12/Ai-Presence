from pydantic import BaseModel


class TextPayload(BaseModel):
    text: str


class ResumeReviewRequest(BaseModel):
    resume_text: str
    target_role: str | None = None


class JDAnalyzeRequest(BaseModel):
    resume_text: str | None = None
    job_description: str


class STAREvaluateRequest(BaseModel):
    question: str
    answer: str


class CodingEvaluateRequest(BaseModel):
    question: str
    solution: str
    language: str = "javascript"


class InterviewStartRequest(BaseModel):
    role: str = "Software Engineer"
    difficulty: str = "entry"
    interview_type: str = "behavioral"


class InterviewAnswerRequest(BaseModel):
    question: str
    answer: str
    role: str = "Software Engineer"
