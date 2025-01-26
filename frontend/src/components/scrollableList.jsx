import React from "react";
import "./scrollableList.css";

const ScrollableList = ({ items }) => {
  const handleDownload = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:8080/download/${fileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;


      const file = items.find(item => item.fileId === fileId);
      link.download = file ? file.name : 'downloaded-file';

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        <div className="header-cell">Name</div>
        <div className="header-cell center">Uploaded on</div>
        <div className="header-cell center">Size</div>
        <div className="header-cell right">Request</div>
      </div>

      <div className="list-content">
        {items.map((item, index) => (
          <div key={item.fileId || index} className="list-row">
            <div className="grid-cell left">{item.name}</div>
            <div className="grid-cell center">{item.uploadedOn}</div>
            <div className="grid-cell center">{item.size}</div>
            <div className="grid-cell right">
              <button
                className="download-button"
                onClick={() => handleDownload(item.fileId)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableList;