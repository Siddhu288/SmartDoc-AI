import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onFilesAccepted }) => {
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    onFilesAccepted(acceptedFiles);
    setRejectedFiles(fileRejections.map(rejection => rejection.file));
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-10 rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
    >
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className="text-blue-600">Drop the files here ...</p> :
          <p className="text-gray-600">Drag 'n' drop some files here, or click to select files</p>
      }
      <em className="text-sm text-gray-500">(Only *.pdf, *.docx, and *.txt files will be accepted)</em>
      {rejectedFiles.length > 0 && (
        <div className="mt-4">
          <p className="text-red-500 font-semibold">Rejected Files:</p>
          <ul>
            {rejectedFiles.map((file, index) => (
              <li key={index} className="text-red-400 text-sm">{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
