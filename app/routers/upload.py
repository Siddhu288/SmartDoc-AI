from io import BytesIO
from fastapi import APIRouter, UploadFile, File
from tempfile import SpooledTemporaryFile
import shutil
import gc
from typing import List
from services.rag import load_document, split_documents, create_embeddings_and_store

router = APIRouter()

@router.post("/upload")
async def upload_document(files: List[UploadFile] = File(...)):
    collection_name = "docubot_collection"
    for file in files:
        file_extension = file.filename.split(".")[-1].lower()
        file_stream = BytesIO(await file.read())


        documents = load_document(file_stream, file_extension)
        # print(documents)
        split_docs = split_documents(documents)
        create_embeddings_and_store(split_docs, collection_name)

        del documents, split_docs, file_stream
        gc.collect()

    return {"message": "Documents uploaded and processed successfully!"}
# async def upload_document(files: List[UploadFile] = File(...)):
#     collection_name = "docubot_collection"
#     for file in files:
#         with SpooledTemporaryFile() as tmp:
#             await shutil.copyfileobj(file.file, tmp)   # Streams instead of reading all into memory
#             tmp.seek(0)
#             documents = load_document(tmp, file.filename.split(".")[-1].lower())
#             split_docs = split_documents(documents)
#             create_embeddings_and_store(split_docs, collection_name)

#     return {"message": "Documents uploaded and processed successfully!"}