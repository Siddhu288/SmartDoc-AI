from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os
import shutil
from app.services.rag import load_document, split_documents, create_embeddings_and_store

router = APIRouter()

UPLOAD_DIR = "./uploaded_docs"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    collection_name = "docubot_collection" # You can make this dynamic if needed
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        print(file_path)    
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file.file.close()

        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["pdf", "docx", "txt"]:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        try:
            documents = load_document(file_path, file_extension)
            print(documents)
            split_docs = split_documents(documents)
            print(split_docs)
            create_embeddings_and_store(split_docs, collection_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing document: {e}")
    
    return {"message": "Documents uploaded and processed successfully!"}
