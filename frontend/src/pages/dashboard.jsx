import React, { useState, useEffect } from 'react';
import './dashboard.css';
import BackgroundAnimation from '../components/backgroundAnimation';
import Upload from '../components/fileUpload';
import Nav from '../components/nav';
import SearchBox from '../components/searchBox';
import ScrollableList from "../components/scrollableList";
import teamLogo from '../assets/gadget_labs.svg';

function Dashboard({isDarkMode, toggleDarkMode}) {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // for UI testing
  const testFilesForUI = [
    { name: "Document1.pdx", uploadedOn: "Jan 15, 2025", size: "2 MB" },
    { name: "Presentation2.txt", uploadedOn: "Jan 14, 2025", size: "5 MB" },
    { name: "Spreadsheet3.xlsx", uploadedOn: "Jan 13, 2025", size: "1 MB" },
    { name: "Image4.webp", uploadedOn: "Jan 12, 2025", size: "3 MB" },
    { name: "Video5.mkv", uploadedOn: "Jan 11, 2025", size: "15 MB" },
    { name: "Document1.pdx", uploadedOn: "Jan 15, 2025", size: "2 MB" },
    { name: "Presentation2.txt", uploadedOn: "Jan 14, 2025", size: "5 MB" },
    { name: "Spreadsheet3.xlsx", uploadedOn: "Jan 13, 2025", size: "1 MB" },
    { name: "Image4.webp", uploadedOn: "Jan 12, 2025", size: "3 MB" },
    { name: "Video5.mkv", uploadedOn: "Jan 11, 2025", size: "15 MB" },
  ];
  // 

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:8080/files');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const transformedFiles = data.map(file => ({
          name: file.fileName,
          uploadedOn: new Date(file.uploadedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          size: `${(file.fileSize / 1024 / 1024).toFixed(2)} MB`,
          fileId: file.fileId
        }));

        setFiles(transformedFiles);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch files:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  return (
    <>
      <Nav isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
        <BackgroundAnimation
          imageUrl={teamLogo}
          opacity={0.035}
          animationDuration={150}
          patternSize={125}
        >
          <div className='content' id='dashboardcontent'>
            <div className="container" id="dashboard">
              <SearchBox />
              {/* <ScrollableList items={testFilesForUI} /> */}
              {isLoading ? (
                <div className="loading">Loading files...</div>
              ) : error ? (
                <div className="error">Error: {error}</div>
              ) : (
                <ScrollableList items={files} />
              )}
            </div>
            <div className="container" id="upload">
              <Upload />
            </div>
          </div>
        </BackgroundAnimation>
    </>
  )
}

export default Dashboard;