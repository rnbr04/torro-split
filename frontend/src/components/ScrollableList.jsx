import React from "react";
import "./ScrollableList.css";
import "./SearchBox.css"

const ScrollableList = ({ items }) => {
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
          <div key={index} className="list-row">
            <div className="grid-cell left">{item.name}</div>
            <div className="grid-cell center">{item.uploadedOn}</div>
            <div className="grid-cell center">{item.size}</div>
            <div className="grid-cell right">
              <button className="download-button">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableList;
