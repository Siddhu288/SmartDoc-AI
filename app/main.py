from fastapi import FastAPI, Request, HTTPException
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from db.chroma_store import get_chroma_client
from routers import upload, qa, summarize

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
    "https://smartdoc-ai-alpha.vercel.app" # FastAPI development server (if serving frontend from here)
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

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/")
async def root(request: Request):
    return {"message": "Welcome to DocuBot AI!"}

@app.delete("/api/v1/delete_collection")
async def delete_collection():
    client = get_chroma_client()
    try:
        collections = client.list_collections()
        if any(c.name == "docubot_collection" for c in collections):
            client.delete_collection("docubot_collection")
            return {"message": "Collection deleted successfully"}
        else:
            return {"message": "No collection to delete"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting collection: {str(e)}")
