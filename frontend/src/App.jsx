// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import UploadPage from './pages/UploadPage';
// import ChatPage from './pages/ChatPage';
// import AppTheme from './AppTheme';
// import api from './api';
// // import { useNavigate } from 'react-router-dom';
// function App() {
//   useEffect( () => {
//       api.get('/').then((response) => {
//       alert(response.data.message); 
//       console.log(response.data.message);
//     }).catch((error) => {
//       console.error('There was an error!', error);
//     });
//   }, []);
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<UploadPage />} />
//         <Route path="/chat" element={<ChatPage />} />
//       </Routes>
//     </Router>
//     // <AppTheme/>
//   );
// }

// export default App;
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ChatPage from "./pages/ChatPage";
import AppTheme from "./AppTheme";
import api from "./api";
function HomePage() {

  useEffect(() => {
    api.get("/")
      .then((response) => {
        alert(response.data.message);
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <AppTheme>
      <div>
        <UploadPage/>
      </div>
    </AppTheme>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
