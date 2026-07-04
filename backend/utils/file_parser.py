from io import BytesIO
from fastapi import UploadFile


async def extract_text_from_upload(file: UploadFile) -> str:
    data = await file.read()
    filename = (file.filename or "").lower()
    if filename.endswith(".pdf"):
        try:
            from pypdf import PdfReader
            reader = PdfReader(BytesIO(data))
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception:
            return ""
    if filename.endswith(".docx"):
        try:
            from docx import Document
            doc = Document(BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs)
        except Exception:
            return ""
    return data.decode("utf-8", errors="ignore")
