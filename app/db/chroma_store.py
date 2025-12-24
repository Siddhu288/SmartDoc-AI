import chromadb
import os

def get_chroma_client():
    DB_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
    # print(DB_PATH)
    os.makedirs(DB_PATH, exist_ok=True)

    client = chromadb.PersistentClient(path=DB_PATH)
    # client = chromadb.Client()
    return client

def get_or_create_collection(collection_name: str):
    client = get_chroma_client()
    # client = chromadb.PersistentClient(path="chroma_db")    
    collection = client.get_or_create_collection(name=collection_name)
    print(collection)
    print(collection.count())
    return collection
def count_documents(collection_name: str):
    # return get_chroma_client().count_documents(collection_name)
    client = get_chroma_client()
    collection = client.get_collection(collection_name)
    return collection.count()

# if __name__ == "__main__":
    # get_or_create_collection("docubot_collection")
    # print("Collection created")
    # print(count_documents("docubot_collection"))