from operator import contains
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag import get_rag_chain
from app.db.chroma_store import get_chroma_client

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    collection_name: str = "docubot_collection"

@router.post("/qa")
async def answer_question(request: QueryRequest):
    try:
        qa_chain = get_rag_chain(request.collection_name)

        # Check if user wants to close/delete the collection
        if "close" in request.query.lower():
            client = get_chroma_client()
            client.delete_collection(request.collection_name)
            return {"answer": "✅ Collection deleted"}

        # Otherwise, run the QA chain
        response = qa_chain.invoke({"query": request.query})
        return {"answer": response["result"]}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying document: {e}")
