# DataJar Task - Markdown to Slides

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A fullstack application that converts **Markdown files or text into JSON-based slide decks** with suggested design themes.  
The frontend is built with **Next.js**, and the backend is built with **FastAPI** connected to **PostgreSQL**.

---

## Live Demo
[Access the deployed frontend on AWS here](http://ec2-51-20-114-212.eu-north-1.compute.amazonaws.com:3000/)

---

## Features
- Upload Markdown files or paste Markdown text.  
- Convert Markdown to a JSON slide deck with a design theme.  
- Download generated slides as HTML.  
- Backend uses PostgreSQL for storing interactions.  
- Fully dockerized (frontend, backend, database).  

---

## Project Structure
```
.
├── backend/             # FastAPI backend
│   ├── app/
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── schemas.py   # Corrected from 'schema.py' based on file list
│   │   ├── routes.py
│   │   ├── services.py
│   │   ├── llm.py
│   │   ├── utils.py
│   │   └── main.py
│   └── Dockerfile
├── frontend/            # Next.js frontend
│   ├── app/
│   │   └── page.jsx     # Assuming HomePage component is here
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── frontend.Dockerfile
├── db/                  # Database & migrations (Placeholder for Alembic)
│   └── migrations/
├── docker-compose.yml
├── .env                 # Environment variables for Docker Compose
└── README.md
```

---

## Setup & Installation

### 1. Clone the repo:
```bash
git clone <your-repo-url>
cd <repo-directory>
```

### 2. Create a `.env` file in the project's root directory:
Replace placeholders with your values:
```env
POSTGRES_PASSWORD=yourpassword
DATABASE_URL=postgresql+asyncpg://postgres:yourpassword@db:5432/mydb
GEMINI_API_KEY=your_api_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run the application with Docker Compose:
```bash
docker-compose up --build
```

- Backend will be available at: **http://localhost:8000**  
- Frontend will be available at: **http://localhost:3000**  

---

## Database Access

To connect to PostgreSQL within the running db container:
```bash
docker exec -it <db_container_name> psql -U postgres -d mydb
```

Example query to preview table contents:
```sql
SELECT
    id,
    LEFT(prompt, 50) AS prompt_preview,
    LEFT(response_json, 50) AS response_preview
FROM interactions
LIMIT 10;
```

---

## Video Tutorial

Watch this video to learn how to use the project:  
![demo video](http://github.com/mohamedIbnKhaled/data-jar-task/blob/main/demo.mkv)

---

## API Endpoints

| Endpoint           | Method | Description                       |
|--------------------|--------|-----------------------------------|
| `/convert-md`       | POST   | Convert uploaded Markdown file     |
| `/convert-md-text`  | POST   | Convert Markdown text from input   |
| `/interactions`     | GET    | Retrieve recent interactions data  |

---

## Frontend Usage

1. Access the frontend at [http://localhost:3000](http://localhost:3000) in your browser.  
2. Choose either the **"Upload File"** tab to upload a Markdown (`.md`) file or the **"Paste Text"** tab to input Markdown content directly.  
3. Click the **"Generate Slides"** or **"Generate Slides from Text"** button to convert your Markdown.  
4. View the generated slides and suggested design theme.  
5. Optionally, click **"Download as HTML"** to save the presentation locally.  

---
