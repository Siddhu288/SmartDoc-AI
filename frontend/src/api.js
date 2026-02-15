import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:8000"
    : "https://smartdoc-ai-t8p8.onrender.com",
});

export default api;
