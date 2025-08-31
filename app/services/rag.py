from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
# from langchain.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
# import chromadb
import os

from app.db.chroma_store import get_chroma_client

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or "AIzaSyBqFJMlVbjCfHzkXvOhA4tsiH9CEYybNEw"

def load_document(file_path: str, file_type: str):
    if file_type == "pdf":
        loader = PyPDFLoader(file_path)
    elif file_type == "docx":
        loader = Docx2txtLoader(file_path)
    elif file_type == "txt":
        loader = TextLoader(file_path)
    else:
        raise ValueError("Unsupported file type")
    return loader.load()

def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return text_splitter.split_documents(documents)

def create_embeddings_and_store(documents, collection_name: str):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
    # Use a persistent client for ChromaDB
    client = get_chroma_client()
    # client = chromadb.PersistentClient(path="../chroma_db")
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        client=client,
        collection_name=collection_name,
    )
    return vector_store

def get_rag_chain(collection_name: str):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
    client = get_chroma_client()
    vector_store = Chroma(client=client, collection_name=collection_name, embedding_function=embeddings)
    
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.5, google_api_key=GEMINI_API_KEY)
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever()
    )
    print(qa_chain)
    return qa_chain
