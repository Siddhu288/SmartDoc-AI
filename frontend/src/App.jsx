import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import { CustomThemeProvider } from "./contexts/ThemeContext"; // ✅ import wrapper

function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <Toaster/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
