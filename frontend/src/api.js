// import axios from "axios";

// const isLocalhost = window.location.hostname === "localhost";

// const api = axios.create({
//   baseURL: isLocalhost
//     ? "http://localhost:8000" // local FastAPI backend
//     : "https://smartdoc-ai-t8p8.onrender.com", // Render backend URL
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export default api;
