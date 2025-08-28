from pydantic import BaseModel
from typing import List, Dict

class MarkdownTextRequest(BaseModel):
    text: str

class SlideResponse(BaseModel):
    slides: List[Dict[str, str]]
    design_theme: str
    html_export: str
