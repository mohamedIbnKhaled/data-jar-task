def build_html_export(slides_and_theme: dict) -> str:
    slides = slides_and_theme["slides"]
    theme = slides_and_theme["design_theme"]
    return f"""
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Slide Deck: {theme}</title>
<script src='https://cdn.tailwindcss.com'></script>
<style>
body {{ background-color:#1a202c; color:#e2e8f0; font-family:Inter,sans-serif; }}
</style>
</head>
<body class='p-8'>
<h1 class='text-5xl text-center mb-4'>Slide Deck</h1>
<p class='text-xl text-center mb-12'>Design Theme: <b>{theme}</b></p>
<div class='space-y-16'>
{''.join(f"<div class='bg-gray-800 p-8 rounded-xl'><h2 class='text-3xl mb-4'>{s['title']}</h2><p>{s['content']}</p></div>" for s in slides)}
</div>
</body>
</html>
""".strip()
