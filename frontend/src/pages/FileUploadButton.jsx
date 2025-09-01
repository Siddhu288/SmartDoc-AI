// import React, { useState } from "react";
// import { IconButton, Button, LinearProgress } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import api from "../api";

// const FileUploadButton = () => {
//   const [uploading, setUploading] = useState(false);

//   const handleFileSelect = async (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length === 0) return;

//     setUploading(true);

//     const formData = new FormData();
//     files.forEach((file) => formData.append("files", file));

//     try {
//       await api.post("/api/v1/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("✅ Files uploaded successfully!");
//     } catch (error) {
//       console.error("❌ Error uploading files:", error);
//       alert(error.response?.data?.detail || "Error uploading files.");
//     } finally {
//       setUploading(false);
//       event.target.value = null; // reset input
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         id="chat-file-input"
//         style={{ display: "none" }}
//         multiple
//         onChange={handleFileSelect}
//       />
//       <IconButton
//         color="primary"
//         onClick={() => document.getElementById("chat-file-input").click()}
//         disabled={uploading}
//       >
//         <AddIcon />
//       </IconButton>
//     </div>
//   );
// };

// export default FileUploadButton;



import React, { useState } from "react";
import { IconButton, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import api from "../api";

const FileUploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await api.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });
      alert("✅ Files uploaded successfully!");
    } catch (error) {
      console.error("❌ Error uploading files:", error);
      alert(error.response?.data?.detail || "Error uploading files.");
    } finally {
      setUploading(false);
      setProgress(0);
      event.target.value = null; // reset input
    }
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
        <input
            type="file"
            id="chat-file-input"
            style={{ display: "none" }}
            multiple
            onChange={handleFileSelect}
        />
        
        {!uploading && (
        <IconButton
            color="primary"
            onClick={() => document.getElementById("chat-file-input").click()}
            sx={{ width: 42, height: 40}}
        >
            <AddIcon />
        </IconButton>
        )}

      {uploading && (
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0,
            width: 56,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Square progress border */}
          <Box
            sx={{
              position: "absolute",
              width: 56,
              height: 40,
              border: "4px solid #383F94",
              borderRadius: 1,
              clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0)",
              transform: `rotate(${(progress / 100) * 360}deg)`,
            }}
          />
          <Typography
            variant="caption"
            component="div"
            sx={{
              position: "absolute",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            {`${progress}%`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadButton;
