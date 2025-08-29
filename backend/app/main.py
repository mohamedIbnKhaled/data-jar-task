from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router    
from app.db import  init_db 

app = FastAPI(
    title="Markdown-to-Slides Agent"
)

origins = [
    "http://localhost:3000",
    "http://172.19.0.4:3000", 
    "http://ec2-51-20-114-212.eu-north-1.compute.amazonaws.com:3000/"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Backend is running."}
