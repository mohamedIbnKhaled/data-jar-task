import json
from fastapi import UploadFile, HTTPException
import chardet
from .llm import generate_slides_from_markdown
from .utils import build_html_export
from . import models, db

async def handle_file_upload(file: UploadFile):
    try:
        contents_bytes = await file.read()
        detected_encoding = chardet.detect(contents_bytes)["encoding"] or "utf-8"
        content_text = contents_bytes.decode(detected_encoding, errors="replace")
        if not content_text.strip():
            raise ValueError("The uploaded file is empty.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {e}")

    return await process_markdown(content_text)

async def handle_text_input(text: str):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Markdown text cannot be empty.")
    return await process_markdown(text)

async def process_markdown(content_text: str):
    slides_and_theme = await generate_slides_from_markdown(content_text)
    html_export = build_html_export(slides_and_theme)

    interaction = models.Interaction(
        prompt=content_text,
        response_json=json.dumps(slides_and_theme),
    )
    async with db.async_session() as session:
        session.add(interaction)
        await session.commit()

    return {
        "slides": slides_and_theme["slides"],
        "design_theme": slides_and_theme["design_theme"],
        "html_export": html_export,
    }

async def get_recent_interactions(limit: int = 10):
    async with db.async_session() as session:
        result = await session.execute(
            models.Interaction.__table__.select().order_by(models.Interaction.id.desc()).limit(limit)
        )
        rows = result.fetchall()
        return [dict(r._mapping) for r in rows]
