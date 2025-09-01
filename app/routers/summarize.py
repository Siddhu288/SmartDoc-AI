# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.chains.summarize import load_summarize_chain
# from langchain_community.vectorstores import Chroma
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from app.db.chroma_store import get_chroma_client
# from dotenv import load_dotenv
# from typing import Optional
# import os

# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or "AIzaSyBqFJMlVbjCfHzkXvOhA4tsiH9CEYybNEw"

# router = APIRouter()

# class SummarizeRequest(BaseModel):
#     collection_name: Optional[str] = "docubot_collection"
#     query: Optional[str] = "summarize this document"

# @router.post("/summarize")
# async def summarize_document(request: SummarizeRequest):
#     try:
#         embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
#         client = get_chroma_client()
#         vector_store = Chroma(client=client, collection_name=request.collection_name, embedding_function=embeddings)
        
#         llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5, google_api_key=GEMINI_API_KEY)
        
#         # Retrieve all documents from the collection for summarization
#         # Note: This might be inefficient for very large collections. 
#         # A more robust solution might involve retrieving top-k relevant documents for summarization 
#         # or handling summarization of specific parts.
#         all_docs = vector_store._collection.get(limit=1000)['documents'] # Retrieve up to 1000 documents
#         print(all_docs)
#         # LangChain's load_summarize_chain expects Document objects
#         from langchain.docstore.document import Document
#         langchain_docs = [Document(page_content=doc) for doc in all_docs]

#         chain = load_summarize_chain(llm, chain_type="stuff")
#         summary = chain.run(langchain_docs)
#         print(summary)
#         return {"summary": summary}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error summarizing document: {e}")


from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.docstore.document import Document
from app.db.chroma_store import get_chroma_client
from dotenv import load_dotenv
from typing import Optional
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 


router = APIRouter()

class SummarizeRequest(BaseModel):
    collection_name: Optional[str] = "docubot_collection"

@router.post("/summarize")
async def summarize_document(request: SummarizeRequest):
    try:
        # Setup embeddings + vector DB
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001", 
            google_api_key=GEMINI_API_KEY
        )
        client = get_chroma_client()
        vector_store = Chroma(
            client=client, 
            collection_name=request.collection_name, 
            embedding_function=embeddings
        )

        # Fetch all docs
        all_docs = vector_store.get(limit=1000)
        if not all_docs["documents"]:
            raise HTTPException(status_code=404, detail="No documents found in collection")

        langchain_docs = [
            Document(page_content=doc, metadata=meta or {})
            for doc, meta in zip(all_docs["documents"], all_docs.get("metadatas", [{}]*len(all_docs["documents"])))
        ]

        # Concatenate docs into one string for summarization
        full_text = "\n\n".join([doc.page_content for doc in langchain_docs])

        # Setup streaming LLM
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.5,
            google_api_key=GEMINI_API_KEY,
            streaming=True
        )

        # Streaming generator
        async def token_stream():
            prompt = f"Summarize the following document:\n\n{full_text}"
            async for chunk in llm.astream(prompt):
                yield chunk.content  # each token

        

        return StreamingResponse(token_stream(), media_type="text/plain" , headers={"Cache-Control": "no-store"})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error summarizing document: {e}")
