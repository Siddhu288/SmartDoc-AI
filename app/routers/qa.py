from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.rag import get_rag_chain
from db.chroma_store import get_chroma_client
from fastapi.responses import JSONResponse
from langchain_google_genai import ChatGoogleGenerativeAI
import os

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    collection_name: str = "docubot_collection"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@router.post("/qa")
async def answer_question(request: QueryRequest):
    try:
        # 1️⃣ Get retriever from RetrievalQA
        qa_chain = get_rag_chain(request.collection_name)
        retriever = qa_chain.retriever

        # Handle delete intent
        if "close" in request.query.lower():
            client = get_chroma_client()
            client.delete_collection(request.collection_name)
            return {"answer": "✅ Collection deleted"}

        # 2️⃣ Retrieve documents
        docs = retriever.get_relevant_documents(request.query)
        print("🔍 Retrieved docs:", len(docs))

        if not docs:
            return {
                "answer": "⚠️ I couldn’t find relevant information in the uploaded documents."
            }

        # 3️⃣ Build context
        context = "\n\n".join([doc.page_content for doc in docs[:4]])

        # 4️⃣ Build prompt
        prompt = f"""
You are a helpful assistant. Answer the question using ONLY the context below.
If the answer is not present, say you don't know.

Context:
{context}

Question:
{request.query}

Answer:
"""

        # 5️⃣ Create LLM EXPLICITLY (this is the fix)
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-pro",
            temperature=0.5,
            google_api_key=GEMINI_API_KEY
        )

        # 6️⃣ Invoke LLM
        response = llm.invoke(prompt)

        return JSONResponse(
            {"answer": response.content},
            headers={"Cache-Control": "no-store"}
        )

    except Exception as e:
        print("🔥 QA ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))
