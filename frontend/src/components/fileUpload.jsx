import React, { useCallback, useState, useRef } from 'react';
import './fileUpload.css'


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
    
    // Here you can handle file upload logic
    console.log('Dropped files:', droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    
    // Here you can handle file upload logic
    console.log('Selected files:', selectedFiles);
  }, []);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      
      <div
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full 
          min-h-[200px] 
          border-2 
          border-dashed 
          rounded-lg 
          flex 
          flex-col 
          items-center 
          justify-center 
          cursor-pointer 
          transition-all
          duration-300
          ${isDragging 
            ? 'border-green-500 bg-green-50 shadow-lg shadow-green-200 ring-4 ring-green-500 ring-opacity-20' 
            : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <div className="p-6 text-center">
          {isDragging ? (
            // Checkmark icon when dragging
            <svg
              className="mx-auto h-12 w-12 text-green-500 transition-all duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            // Upload arrow icon when not dragging
            <svg
              className="mx-auto h-12 w-12 text-gray-400 transition-all duration-300"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M24 8v20m0-20l-8 8m8-8l8 8m-8 12h.01"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <p className={`mt-2 text-sm ${isDragging ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
            {isDragging ? 'Drop to upload' : <span>Click to upload or drag and drop</span>}
          </p>
          <p className={`mt-1 text-xs ${isDragging ? 'text-green-500' : 'text-gray-500'}`}>
            Any file up to 10MB
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2 text-sm text-gray-600">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Upload;