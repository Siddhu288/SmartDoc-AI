from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import upload, qa, summarize

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",  # React frontend development server
    "http://localhost:8000", 
    "http://localhost:5173" # FastAPI development server (if serving frontend from here)
    # Add your Vercel frontend URL here when deploying
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/v1")
app.include_router(qa.router, prefix="/api/v1")
app.include_router(summarize.router, prefix="/api/v1")

@app.get("/")
async def read_root():
    return {"message": "Welcome to DocuBot AI!"}
