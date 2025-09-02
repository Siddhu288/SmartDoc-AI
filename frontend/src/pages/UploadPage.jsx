// import React, { useState } from 'react';
// import Dropzone from '../components/Dropzone';
// import api from '../api';
// import { useNavigate } from 'react-router-dom';
// import AppTheme from '../AppTheme';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   IconButton,
//   Button,
//   LinearProgress,
//   Paper,
//   ListItemText,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const UploadPage = () => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const navigate = useNavigate();

//   const handleFilesAccepted = (files) => {
//     // Append new files, prevent duplicates
//     const newFiles = Array.from(files).filter(
//       (f) => !selectedFiles.some((sf) => sf.name === f.name)
//     );
//     setSelectedFiles((prev) => [...prev, ...newFiles]);
//   };

//   const handleRemoveFile = (index) => {
//     setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const handleUpload = async () => {
//   if (selectedFiles.length === 0) return;

//   setUploading(true);
//   setProgress(0);

//   const formData = new FormData();
//   selectedFiles.forEach((file) => formData.append('files', file));

//   try {
//     await api.post('/api/v1/upload', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//       onUploadProgress: (progressEvent) => {
//         if (progressEvent.total) {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percentCompleted); // updates in real-time
//         }
//       },
//     });

//     alert('✅ Files uploaded successfully!');
//     setSelectedFiles([]);
//     navigate('/chat');
//   } catch (error) {
//     console.error('❌ Error uploading files:', error);
//     alert(error.response?.data?.detail || 'Error uploading files.');
//   } finally {
//     setUploading(false);
//   }
// };

//   return (
//     <AppTheme>
//       <Box
//         sx={{
//           minHeight: '100vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           bgcolor: 'background.default',
//           p: 2,
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{ p: 4, borderRadius: 2, width: '100%', maxWidth: 480 }}
//         >
//           <Typography variant="h4" align="center" gutterBottom>
//             Upload Your Documents
//           </Typography>

//           <Dropzone onFilesAccepted={handleFilesAccepted} multiple />

//           {selectedFiles.length > 0 && (
//             <Box mt={3}>
//               <Typography variant="h6" gutterBottom>
//                 Selected Files:
//               </Typography>
//               <List>
//                 {selectedFiles.map((file, index) => (
//                   <ListItem
//                     key={index}
//                     secondaryAction={
//                       <IconButton
//                         edge="end"
//                         color="error"
//                         onClick={() => handleRemoveFile(index)}
//                       >
//                         <CloseIcon />
//                       </IconButton>
//                     }
//                   >
//                     <ListItemText primary={file.name} />
//                   </ListItem>
//                 ))}
//               </List>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 fullWidth
//                 disabled={uploading}
//                 onClick={handleUpload}
//                 sx={{
//                   mt: 2,
//                   '&.Mui-disabled': {
//                     bgcolor: 'primary.main', // keep same background
//                     color: 'black',           // force visible text
//                     opacity: 0.8,            // looks disabled but readable
//                   },
//                 }}

//               >
//                 {uploading ? 'Uploading...' : 'Upload & Continue'}
//               </Button>

//               {uploading && (
//                 <Box sx={{ mt: 2 }}>
//                   <Typography
//                     variant="body2"
//                     color="textSecondary"
//                     sx={{ mb: 1, textAlign: 'center' }}
//                   >
//                     {progress}% completed
//                   </Typography>
//                   <LinearProgress variant="determinate" value={progress} />
//                 </Box>
//               )}

//             </Box>
//           )}
//         </Paper>
//       </Box>
//     </AppTheme>
//   );
// };

// export default UploadPage;





import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  ArrowBack,
  CloudUpload,
  Delete,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect } from 'react';
import api from '../api';

const UploadPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // When UploadPage mounts, delete old collection
    api.delete("/api/v1/delete_collection")
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.error("Error deleting collection:", err);
      });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.type.includes('word') ||
      file.type === 'text/plain'
    );

    const newFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.type.includes('word') ||
      file.type === 'text/plain'
    );

    const newFiles = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const simulateUpload = useCallback(async () => {
    if (files.length === 0) return;
  
    setIsUploading(true);
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status === 'pending') {
        // Mark file as uploading
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
          )
        );
  
        try {
          // Simulate FormData + upload like handleUpload
          const formData = new FormData();
          formData.append("files", file.file); // assuming file.file is the raw File object
  
          // Instead of real API call, simulate upload progress
          for (let loaded = 0; loaded <= 100; loaded += 10) {
            await new Promise(resolve => setTimeout(resolve, 150)); // slower for realism
            setFiles(prev =>
              prev.map(f =>
                f.id === file.id ? { ...f, progress: loaded } : f
              )
            );
          }
  
          // Mark as completed
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id ? { ...f, status: "completed" } : f
            )
          );
        } catch (err) {
          console.error("❌ Simulated upload failed:", err);
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id ? { ...f, status: "error" } : f
            )
          );
        }
      }
    }
  
    setIsUploading(false);
  
    // Navigate just like handleUpload
    navigate("/chat");
  }, [files, navigate]);
  

  const getFileIcon = (fileName) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.pdf')) return '📄';
    if (lower.endsWith('.doc') || lower.endsWith('.docx')) return '📝';
    if (lower.endsWith('.txt')) return '📃';
    return '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: darkMode
          ? 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Branding Text */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: darkMode ? 0.03 : 0.02,
          fontSize: { xs: '8rem', sm: '12rem', md: '16rem' },
          fontWeight: 'bold',
          color: darkMode ? '#ffffff' : '#1c1c1e',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-15deg)',
          userSelect: 'none',
          zIndex: 0
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <Typography
            key={i}
            sx={{
              fontSize: 'inherit',
              fontWeight: 'inherit',
              color: 'inherit',
              margin: '2rem',
              transform: `rotate(${Math.random() * 30 - 15}deg)`
            }}
          >
            SmartDoc AI
          </Typography>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{
            mb: 4,
            color: darkMode ? '#ffffff' : '#1c1c1e',
            '&:hover': {
              backgroundColor: darkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(28,28,30,0.1)'
            }
          }}
        >
          Back to Home
        </Button>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 200px)'
          }}
        >
          <Paper
            elevation={darkMode ? 8 : 4}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 800,
              background: darkMode
                ? 'rgba(44,44,46,0.95)'
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: darkMode
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                textAlign: 'center',
                color: darkMode ? '#ffffff' : '#1c1c1e'
              }}
            >
              Upload Documents
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                textAlign: 'center',
                color: darkMode ? '#8e8e93' : '#6d6d70'
              }}
            >
              Drag & drop your documents or click to select files
            </Typography>

            {/* Upload Zone */}
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                border: isDragOver
                  ? `3px dashed #4146C7`
                  : `2px dashed ${darkMode ? '#5a5a5c' : '#d1d1d6'}`,
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                backgroundColor: isDragOver
                  ? (darkMode
                    ? 'rgba(65,70,199,0.1)'
                    : 'rgba(65,70,199,0.05)')
                  : (darkMode
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(0,0,0,0.02)'),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                mb: 3,
                '&:hover': {
                  backgroundColor: darkMode
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                  borderColor: '#4146C7'
                }
              }}
              onClick={() =>
                document.getElementById('file-upload')?.click()
              }
            >
              <CloudUpload
                sx={{
                  fontSize: 60,
                  color: '#4146C7',
                  mb: 2
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: darkMode ? '#ffffff' : '#1c1c1e'
                }}
              >
                Drag & Drop documents here
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: darkMode ? '#8e8e93' : '#6d6d70' }}
              >
                or click to select files
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: darkMode ? '#8e8e93' : '#6d6d70',
                  mt: 1,
                  display: 'block'
                }}
              >
                Supports PDF, Word, and Text files
              </Typography>
            </Box>

            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* File List */}
            {files.length > 0 && (
              <Box sx={{ mb: 3, maxHeight: 300, overflow: 'auto' }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    color: darkMode ? '#ffffff' : '#1c1c1e'
                  }}
                >
                  Selected Files
                </Typography>
                <List>
                  {files.map((file) => (
                    <ListItem
                      key={file.id}
                      sx={{
                        backgroundColor: darkMode
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.02)',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <Box sx={{ mr: 2, fontSize: '1.5rem' }}>
                        {getFileIcon(file.file.name)}
                      </Box>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Typography
                              sx={{
                                color: darkMode
                                  ? '#ffffff'
                                  : '#1c1c1e'
                              }}
                            >
                              {file.file.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={file.status}
                              color={
                                file.status === 'completed'
                                  ? 'success'
                                  : file.status === 'uploading'
                                    ? 'primary'
                                    : file.status === 'error'
                                      ? 'error'
                                      : 'default'
                              }
                              icon={
                                file.status === 'completed' ? (
                                  <CheckCircle />
                                ) : undefined
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <Typography
                            component="span" 
                            variant="caption"
                            sx={{
                              display: 'block',
                              color: darkMode
                                ? '#8e8e93'
                                : '#6d6d70'
                            }}
                          >
                            {formatFileSize(file.file.size)}
                            {file.status === 'uploading' && (
                              <LinearProgress
                                variant="determinate"
                                value={file.progress}
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => removeFile(file.id)}
                          disabled={file.status === 'uploading'}
                          sx={{
                            color: darkMode ? '#8e8e93' : '#6d6d70'
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Upload Button */}
            {files.length > 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={simulateUpload}
                  disabled={
                    isUploading || files.every(f => f.status === 'completed')
                  }
                  sx={{
                    backgroundColor: '#4146C7',
                    color: '#ffffff',
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: '#353ba3'
                    },
                    '&:disabled': {
                      backgroundColor: darkMode
                        ? '#3a3a3c'
                        : '#e5e5ea'
                    }
                  }}
                  startIcon={<CloudUpload />}
                >
                  {isUploading ? 'Uploading...' : 'Upload & Continue'}
                </Button>
              </Box>
            )}

            {files.length === 0 && (
              <Alert
                severity="info"
                sx={{
                  backgroundColor: darkMode
                    ? 'rgba(52,120,246,0.1)'
                    : 'rgba(52,120,246,0.05)',
                  color: darkMode ? '#ffffff' : '#1c1c1e',
                  '& .MuiAlert-icon': {
                    color: '#4146C7'
                  }
                }}
              >
                Select or drag files to get started with document analysis
              </Alert>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default UploadPage;
