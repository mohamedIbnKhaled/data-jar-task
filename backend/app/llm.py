import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError(" Missing GEMINI_API_KEY in .env")

genai.configure(api_key=GEMINI_API_KEY)

async def generate_slides_from_markdown(content_text: str):
    prompt = f'''
    Convert the following Markdown into a JSON object with two keys:
    - "slides": an array of slide objects (each with "title" and "content").
    - "design_theme": a creative string for a design theme.

    Markdown:
    ---
    {content_text}
    ---
    Example:
    {{"slides":[{{"title":"Slide 1","content":"content"}}],"design_theme":"Minimalist Blue"}}
    '''
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    generated_text = response.text.strip()

    clean_response = generated_text.lstrip("```json").rstrip("```").strip()
    slides_and_theme = json.loads(clean_response)

    if not isinstance(slides_and_theme, dict) or        "slides" not in slides_and_theme or        "design_theme" not in slides_and_theme:
        raise ValueError("Invalid response format from Gemini.")

    return slides_and_theme
