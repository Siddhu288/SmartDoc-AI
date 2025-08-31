import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFilesAccepted = (files) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      await api.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percent);
        },
      });

      alert("✅ Files uploaded successfully!");
      setSelectedFiles([]); // clear files after upload
      navigate('/chat'); // redirect to chat interface
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      alert(error.response?.data?.detail || "Error uploading files.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Upload Your Documents
        </h1>
        <Dropzone onFilesAccepted={handleFilesAccepted} />

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index} className="text-gray-700">{file.name}</li>
              ))}
            </ul>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-4 w-full py-2 px-4 rounded-md text-white font-semibold transition-colors
                ${uploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {uploading ? `Uploading... ${progress}%` : 'Upload & Continue'}
            </button>

            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
