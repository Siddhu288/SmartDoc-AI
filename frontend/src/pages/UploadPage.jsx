// import React, { useState } from 'react';
// import Dropzone from '../components/Dropzone';
// import api from '../api';
// import { useNavigate } from 'react-router-dom';
// import AppTheme from '../AppTheme';

// const UploadPage = () => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const navigate = useNavigate();

//   const handleFilesAccepted = (files) => {
//     setSelectedFiles(files);
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) return;

//     setUploading(true);
//     setProgress(0);

//     const formData = new FormData();
//     selectedFiles.forEach(file => {
//       formData.append('files', file);
//     });

//     try {
//       await api.post('/api/v1/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percent);
//         },
//       });

//       alert("✅ Files uploaded successfully!");
//       setSelectedFiles([]); // clear files after upload
//       navigate('/chat'); // redirect to chat interface
//     } catch (error) {
//       console.error("❌ Error uploading files:", error);
//       alert(error.response?.data?.detail || "Error uploading files.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <AppTheme >
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold text-center mb-6">
//           Upload Your Documents
//         </h1>
//         <Dropzone onFilesAccepted={handleFilesAccepted} />

//         {selectedFiles.length > 0 && (
//           <div className="mt-6">
//             <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
//             <ul>
//               {selectedFiles.map((file, index) => (
//                 <li key={index} className="text-gray-700">{file.name}</li>
//               ))}
//             </ul>

//             <button
//               onClick={handleUpload}
//               disabled={uploading}
//               className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition-colors
//                 ${uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//             >
//               {uploading ? `Uploading... ${progress}%` : 'Upload & Continue'}
//             </button>

//             {uploading && (
//               <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
//                 <div
//                   className="bg-blue-600 h-2 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//       </AppTheme>
//   );
// };

// export default UploadPage;

import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import AppTheme from '../AppTheme';
import {
  Box,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
  LinearProgress,
  Paper,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFilesAccepted = (files) => {
    // Append new files, prevent duplicates
    const newFiles = Array.from(files).filter(
      (f) => !selectedFiles.some((sf) => sf.name === f.name)
    );
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
  if (selectedFiles.length === 0) return;

  setUploading(true);
  setProgress(0);

  const formData = new FormData();
  selectedFiles.forEach((file) => formData.append('files', file));

  try {
    await api.post('/api/v1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted); // updates in real-time
        }
      },
    });

    alert('✅ Files uploaded successfully!');
    setSelectedFiles([]);
    navigate('/chat');
  } catch (error) {
    console.error('❌ Error uploading files:', error);
    alert(error.response?.data?.detail || 'Error uploading files.');
  } finally {
    setUploading(false);
  }
};

  return (
    <AppTheme>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 480 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Upload Your Documents
          </Typography>

          <Dropzone onFilesAccepted={handleFilesAccepted} multiple />

          {selectedFiles.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Selected Files:
              </Typography>
              <List>
                {selectedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={uploading}
                onClick={handleUpload}
                sx={{
                  mt: 2,
                  '&.Mui-disabled': {
                    bgcolor: 'primary.main', // keep same background
                    color: 'black',           // force visible text
                    opacity: 0.8,            // looks disabled but readable
                  },
                }}

              >
                {uploading ? 'Uploading...' : 'Upload & Continue'}
              </Button>

              {uploading && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1, textAlign: 'center' }}
                  >
                    {progress}% completed
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              )}

            </Box>
          )}
        </Paper>
      </Box>
    </AppTheme>
  );
};

export default UploadPage;
