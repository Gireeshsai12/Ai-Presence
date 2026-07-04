from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from database.session import get_db
from schemas.career import CodingEvaluateRequest, JDAnalyzeRequest, ResumeReviewRequest, STAREvaluateRequest, TextPayload
from services.career_service import analyze_communication, analyze_jd, evaluate_code, evaluate_star, score_resume
from services.memory_service import upsert_career_profile
from utils.file_parser import extract_text_from_upload

router = APIRouter()


@router.post("/resume/review")
def review_resume(payload: ResumeReviewRequest, db: Session = Depends(get_db)):
    profile = upsert_career_profile(db, resume_text=payload.resume_text, target_roles=payload.target_role)
    result = score_resume(payload.resume_text, payload.target_role)
    result["stored_profile_id"] = profile.id
    return result


@router.post("/resume/upload-review")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db)):
    text = await extract_text_from_upload(file)
    profile = upsert_career_profile(db, resume_text=text)
    result = score_resume(text)
    result["stored_profile_id"] = profile.id
    result["extracted_characters"] = len(text)
    return result


@router.post("/jd/analyze")
def jd_analyze(payload: JDAnalyzeRequest):
    return analyze_jd(payload.job_description, payload.resume_text)


@router.post("/star/evaluate")
def star_evaluate(payload: STAREvaluateRequest):
    return evaluate_star(payload.question, payload.answer)


@router.post("/coding/evaluate")
def coding_evaluate(payload: CodingEvaluateRequest):
    return evaluate_code(payload.question, payload.solution, payload.language)


@router.post("/communication/analyze")
def communication_analyze(payload: TextPayload):
    return analyze_communication(payload.text)
