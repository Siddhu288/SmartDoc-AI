# SmartDoc AI 📄🤖

Transform documents into intelligent insights instantly with AI-powered document analysis and Q&A.

## Overview

SmartDoc AI is a full-stack application that leverages advanced AI to help users upload documents (PDFs, Word files, and text), generate automatic summaries, and ask natural language questions to extract key insights from their documents.

## Features

✨ **Core Capabilities:**
- 📂 **Multi-format Support**: Upload PDFs, Word documents (.docx), and text files
- 🤖 **AI Summarization**: Automatically generate concise summaries of documents
- 💬 **Interactive Q&A**: Ask questions about your documents in natural language
- 📊 **Key Points Extraction**: Identify important information automatically
- 🎨 **Dark Mode Support**: Beautiful UI with light and dark theme options
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- **Framework**: React 19.1.1
- **UI Library**: Material-UI (MUI) 7.3.1
- **Styling**: Tailwind CSS 3.3.3
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0
- **Notifications**: React Hot Toast 2.6.0
- **Build Tool**: Vite 7.1.2

### Backend
- **Framework**: FastAPI (Python)
- **Vector Database**: ChromaDB
- **LLM Integration**: Google Generative AI (Gemini)
- **Document Processing**: PyPDF2, python-docx
- **Text Splitting**: LangChain
- **API Documentation**: Swagger/OpenAPI

## Project Structure

```
smartdoc-ai/
├── app/                           # FastAPI backend
│   ├── db/
│   │   ├── __init__.py
│   │   └── chroma_store.py       # Vector store configuration
│   ├── routers/
│   │   ├── upload.py             # File upload endpoint
│   │   ├── qa.py                 # Q&A endpoint
│   │   └── summarize.py          # Document summarization endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   └── rag.py                # RAG pipeline & embeddings
│   ├── main.py                   # FastAPI app initialization
│   └── runtime.txt               # Python version specification
│
├── frontend/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatUI.jsx        # Chat message display
│   │   ├── contexts/
│   │   │   └── ThemeContext.jsx  # Dark/light mode context
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Landing page
│   │   │   ├── UploadPage.jsx    # Document upload interface
│   │   │   ├── ChatPage.jsx      # Chat & Q&A interface
│   │   │   └── FileUploadButton.jsx # Reusable upload component
│   │   ├── api.js                # Axios configuration
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/
│   │   └── vite.svg              # App icon
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **npm or yarn** (package manager)
- **Google Gemini API Key** (for AI features)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd app
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn python-multipart chromadb langchain langchain-google-genai PyPDF2 python-docx python-dotenv
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `app/` directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

5. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Usage

### For Users

1. **Home Page**: Visit the landing page to understand features
2. **Upload Documents**: Click "Upload Documents" to upload files
3. **Chat & Q&A**: Ask questions about your documents in natural language
4. **Summarize**: Click the "Summarize" button to get an overview
5. **Dark Mode**: Toggle dark/light mode using the theme button

### API Endpoints

**POST `/api/v1/upload`**
- Upload documents for processing
- Accepts: PDF, DOCX, TXT files
- Returns: Success message

**POST `/api/v1/qa`**
- Ask questions about uploaded documents
- Body: `{ "query": "Your question here", "collection_name": "docubot_collection" }`
- Returns: `{ "answer": "AI generated answer" }`

**POST `/api/v1/summarize`**
- Generate a summary of all uploaded documents
- Body: `{ "collection_name": "docubot_collection" }`
- Returns: Streaming text response

**DELETE `/api/v1/delete_collection`**
- Clear all uploaded documents
- Returns: Success message

## Key Technologies Explained

### RAG (Retrieval-Augmented Generation)
The backend uses RAG to combine document embeddings with LLM capabilities:
1. Documents are split into chunks
2. Chunks are embedded using Google's text-embedding-004 model
3. Embeddings are stored in ChromaDB (vector database)
4. When users ask questions, relevant chunks are retrieved
5. The LLM generates answers based on retrieved context

### ChromaDB
A lightweight vector database that stores document embeddings and enables semantic search for relevant document sections.

### Google Generative AI (Gemini)
Powers both embeddings and text generation:
- **Gemini-2.5-flash**: Fast, efficient LLM for Q&A and summarization
- **text-embedding-004**: High-quality embeddings for semantic search

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_google_gemini_api_key
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:8000  # Local development
VITE_API_URL=https://your-backend-url.com  # Production
```

## Deployment

### Backend (Render/Heroku)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables in platform dashboard
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect frontend folder to Vercel/Netlify
3. Set `VITE_API_URL` environment variable
4. Deploy

## File Upload Limits

- **Maximum file size**: Depends on server configuration (default: ~50MB)
- **Supported formats**: PDF, DOCX, TXT
- **Concurrent uploads**: Multiple files supported

## Performance Optimization

- **Chunk size**: 1000 tokens with 200 token overlap
- **Streaming responses**: Real-time streaming for summarization
- **Lazy loading**: Components load on demand
- **Caching**: API responses cached where applicable

## Known Limitations

- ⚠️ Collection is reset on each new upload session
- ⚠️ No user authentication (single-session usage)
- ⚠️ Document size affects processing time
- ⚠️ Requires active Google Gemini API subscription

## Security Considerations

- 🔒 API keys stored in environment variables
- 🔒 CORS configured for specified domains
- ⚠️ No authentication/authorization implemented
- ⚠️ Consider adding rate limiting for production

## Troubleshooting

### Files not uploading?
- Check backend is running on port 8000
- Verify `VITE_API_URL` points to correct backend
- Check browser console for error messages

### API returning 500 errors?
- Verify `GEMINI_API_KEY` is set correctly
- Check ChromaDB directory permissions
- Review backend logs for detailed errors

### Summarization very slow?
- Large documents take longer to process
- Consider uploading smaller files
- Check API quota limits

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review error messages in browser/server logs

## Future Enhancements

🚀 Planned features:
- User authentication and multi-user support
- Document sharing and collaboration
- Advanced search and filtering
- Export summaries to PDF/Word
- Multi-language support
- Custom AI model selection
- Document annotations and highlighting

---

**Built using React, FastAPI, and Google Gemini**