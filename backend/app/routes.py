from fastapi import APIRouter, UploadFile, File, HTTPException
from . import services, schemas

router = APIRouter()

@router.post("/convert-md", response_model=schemas.SlideResponse)
async def convert_md(file: UploadFile = File(...)):
    return await services.handle_file_upload(file)

@router.post("/convert-md-text", response_model=schemas.SlideResponse)
async def convert_md_text(request: schemas.MarkdownTextRequest):
    return await services.handle_text_input(request.text)

@router.get("/interactions")
async def list_interactions():
    return await services.get_recent_interactions()
