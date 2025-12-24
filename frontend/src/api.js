import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:8000" // local FastAPI backend
    : "https://smartdoc-ai-4xyh.onrender.com", // Render backend URL
});

export default api;
