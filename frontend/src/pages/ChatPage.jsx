// import React, { useState } from 'react';
// import ChatUI from '../components/ChatUI';
// import api from '../api';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (input.trim() === '') return;

//     const userMessage = { sender: 'user', text: input };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await api.post('/api/v1/qa', { query: input });
//       const aiMessage = { sender: 'ai', text: response.data.answer };
//       setMessages((prevMessages) => [...prevMessages, aiMessage]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//       const errorMessage = { sender: 'ai', text: "Sorry, I couldn't process that. Please try again." };
//       setMessages((prevMessages) => [...prevMessages, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const handleSummarize = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.post('http://localhost:8000/api/v1/summarize', {
//   //       collection_name: "docubot_collection",
//   //       query: "summarize this document"
//   //     });
  
//   //     const aiMessage = { sender: 'ai', text: `Summary: ${response.data.summary}` };
//   //     setMessages((prevMessages) => [...prevMessages, aiMessage]);
//   //   } catch (error) {
//   //     console.error("Error summarizing document:", error);
//   //     const errorMessage = { sender: 'ai', text: "Sorry, I couldn't summarize the document." };
//   //     setMessages((prevMessages) => [...prevMessages, errorMessage]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSummarize = async () => {
//     setLoading(true);
//     try {
//       const BACKEND_URL =
//       window.location.hostname === "localhost"
//         ? "http://localhost:8000"                 // local backend
//         : "https://smartdoc-ai-tn57.onrender.com";

//       const response = await fetch(`${BACKEND_URL}/api/v1/summarize`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           collection_name: "docubot_collection",
//         }),
//       });
  
//       if (!response.body) {
//         throw new Error("No response body");
//       }
  
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder("utf-8");
  
//       let partialSummary = "";
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value, { stream: true });
  
//         // update message live
//         partialSummary += chunk;
//         setMessages((prevMessages) => [
//           ...prevMessages.slice(0, -1), // remove last partial if exists
//           { sender: "ai", text: `Summary: ${partialSummary}` },
//         ]);
//       }
//     } catch (error) {
//       console.error("Error summarizing document:", error);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: "ai", text: "Sorry, I couldn't summarize the document." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <header className="bg-white shadow-md p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">SmartDoc AI Chat</h1>
//         <button
//           onClick={handleSummarize}
//           disabled={loading}
//           className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-sm transition-colors"
//         >
//           {loading ? 'Summarizing...' : 'Summarize Document'}
//         </button>
//       </header>
//       <ChatUI messages={messages} />
//       <div className="p-4 bg-white border-t flex items-center">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') handleSendMessage();
//           }}
//           className="flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Ask a question or type a command..."
//           disabled={loading}
//         />
//         <button
//           onClick={handleSendMessage}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md shadow-sm transition-colors"
//         >
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import React, { useState } from 'react';
import ChatUI from '../components/ChatUI';
import api from '../api';
import AppTheme from '../AppTheme';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import FileUploadButton from './FileUploadButton';
import {
  Box,
  Button,
  TextField,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/api/v1/qa', { query: input });
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        sender: 'ai',
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
        window.location.hostname === 'localhost'
          ? 'http://localhost:8000'
          : 'https://smartdoc-ai-tn57.onrender.com';

      const response = await fetch(`${BACKEND_URL}/api/v1/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection_name: 'docubot_collection' }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let partialSummary = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        partialSummary += chunk;
        setMessages((prevMessages) => [
          ...prevMessages.slice(0, -1),
          { sender: 'ai', text: `Summary: ${partialSummary}` },
        ]);
      }
    } catch (error) {
      console.error('Error summarizing document:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: "Sorry, I couldn't summarize the document." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                backgroundColor: '#383F94', // background
                color: 'white',             // text color
                '&:hover': {
                  backgroundColor: '#383F99', // slightly lighter/darker maroon
                },
                '&.Mui-disabled': {
                  backgroundColor: '#383F94', // darker maroon when disabled
                  color: 'white',
                },
              }}
            >
              {loading ? 'Summarizing...' : 'Summarize Document'}
            </Button>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <ChatUI messages={messages} />
        </Box>

        <Container
  sx={{
    display: 'flex',
    py: 2,
    borderTop: 1,
    borderColor: 'divider',
    gap: 1,
    alignItems: 'center',
  }}
>
  <FileUploadButton />
  
  <TextField
    variant="outlined"
    placeholder="Ask a question or type a command..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyPress={(e) => {
      if (e.key === 'Enter') handleSendMessage();
    }}
    fullWidth
    disabled={loading}
  />

  {/* + Button to select files */}
  
  <input
    type="file"
    id="chat-file-input"
    style={{ display: 'none' }}
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      console.log('Selected files:', files);
      // handle files (attach or upload)
    }}
  />

  <Button
    onClick={handleSendMessage}
    disabled={loading}
    sx={{
      backgroundColor: '#383F94',
      '&:hover': { backgroundColor: '#383F99' },
      '&.Mui-disabled': { backgroundColor: '#383F94', color: 'white' },
    }}
  >
    {loading ? 'Sending...' : 'Send'}
  </Button>
</Container>
      </Box>
    </AppTheme>
  );
};

export default ChatPage;
