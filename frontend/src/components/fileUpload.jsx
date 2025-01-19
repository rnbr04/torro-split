import React, { useCallback, useState, useRef } from 'react';
import './fileUpload.css';

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    console.log('Dropped files:', droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    console.log('Selected files:', selectedFiles);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="file-input"
        multiple
      />
      
      <div
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone ${isDragging ? 'drop-zone-hover' : ''}`}
      >
        <div className="drop-zone-content">
          {isDragging ? (
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="icon" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 8v20m0-20l-8 8m8-8l8 8m-8 12h.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <p className={`message ${isDragging ? 'message-hover' : ''}`}>
            {isDragging ? 'Drop to upload' : 'Click to upload or drag and drop'}
          </p>
          <p className={`subtext ${isDragging ? 'subtext-hover' : ''}`}>Any file up to 10MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Upload;
