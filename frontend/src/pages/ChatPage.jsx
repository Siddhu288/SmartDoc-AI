import React, { useState } from "react";
import ChatUI from "../components/ChatUI";
import api from "../api";
import { CustomThemeProvider } from "../contexts/ThemeContext";
import FileUploadButton from "./FileUploadButton";
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/v1/qa", { query: input });
      const aiMessage = { sender: "ai", text: response.data.answer };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        sender: "ai",
        text: "Sorry, I couldn't process that. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const BACKEND_URL =
        window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : "https://smartdoc-ai-4xyh.onrender.com";

      const response = await fetch(`${BACKEND_URL}/api/v1/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection_name: "docubot_collection" }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let partialSummary = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        partialSummary += chunk;
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { sender: "ai", text: `Summary: ${partialSummary}` },
        ]);
      }
    } catch (error) {
      console.error("Error summarizing document:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ai", text: "Sorry, I couldn't summarize the document." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
  
      <CustomThemeProvider>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                SmartDoc AI Chat
              </Typography>
              <Button
                variant="contained"
                color="danger"
                onClick={handleSummarize}
                disabled={loading}
                sx={{
                  backgroundColor: "#383F94", // background
                  color: "white", // text color
                  "&:hover": {
                    backgroundColor: "#383F99", // slightly lighter/darker maroon
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#383F94", // darker maroon when disabled
                    color: "white",
                  },
                }}
              >
                {loading ? "Summarizing..." : "Summarize"}
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            <CustomThemeProvider>
            <ChatUI messages={messages} />
            </CustomThemeProvider>
            {/* {messages} */}
          </Box>

          <Container
            sx={{
              display: "flex",
              py: 2,
              borderTop: 1,
              borderColor: "divider",
              gap: 1,
              alignItems: "center",
            }}
          >
            <FileUploadButton />

            <TextField
              variant="outlined"
              placeholder="Ask a question or type a command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              fullWidth
              disabled={loading}
            />

            {/* + Button to select files */}

            <input
              type="file"
              id="chat-file-input"
              style={{ display: "none" }}
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                console.log("Selected files:", files);
                // handle files (attach or upload)
              }}
            />

            <Button
              onClick={handleSendMessage}
              disabled={loading}
              variant="contained"
              sx={{
                width: "100px",
                backgroundColor: "#383F94",
                "&:hover": { backgroundColor: "#383F99" },
                "&.Mui-disabled": {
                  backgroundColor: "#383F94",
                  color: "white",
                },
              }}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </Container>
        </Box>
      </CustomThemeProvider>
  );
};

export default ChatPage;
