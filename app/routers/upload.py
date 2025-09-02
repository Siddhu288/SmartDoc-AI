from io import BytesIO
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.services.rag import load_document, split_documents, create_embeddings_and_store

router = APIRouter()

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    collection_name = "docubot_collection"
    for file in files:
        file_extension = file.filename.split(".")[-1].lower()
        content = await file.read()
        file_stream = BytesIO(content)

        documents = load_document(file_stream, file_extension)
        # print(documents)
        split_docs = split_documents(documents)
        create_embeddings_and_store(split_docs, collection_name)

    return {"message": "Documents uploaded and processed successfully!"}