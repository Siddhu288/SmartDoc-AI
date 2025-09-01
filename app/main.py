from fastapi import FastAPI, Request, HTTPException
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.db.chroma_store import get_chroma_client
from app.routers import upload, qa, summarize

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

# @app.get("/")
# async def root(request: Request):
#     return {"message": "Welcome to DocuBot AI!"}

@app.get("/")
# async def root(request: Request, close: str = None):
#         client = get_chroma_client()
#         try:
#             client.delete_collection("docubot_collection")
#             print(client.count_collections())  # or request.collection_name if dynamic
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Error deleting collection: {e}")
#         return {"message": "Collection deleted successfully"}
async def root(request: Request, close: str = None):
    client = get_chroma_client()
    try:
        # Delete collection only if it exists
        try:
            client.delete_collection("docubot_collection")
        except Exception as inner_e:
            # Collection might not exist → ignore
            print(f"Warning: {inner_e}")

        # Safely check count
        if hasattr(client, "count_collections"):
            print(client.count_collections())
        else:
            print("count_collections not available in this client version")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting collection: {str(e)}")

    return {"message": "Collection deleted successfully"}