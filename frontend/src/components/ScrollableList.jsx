import React from "react";
import "./ScrollableList.css";
import "./SearchBox.css"

const ScrollableList = ({ items }) => {
  return (
    <div className="list-container">
      <div className="list-header">
        <span className="header-name">Name</span>
        <span className="header-modified">Uploaded on</span>
        <span className="header-size">Size</span>
        <span className="header-size">Request</span>
      </div>
      <div className="list-content">
        {items.map((item, index) => (
          <div key={index} className="list-item">
            <div className="item-name">{item.name}</div>
            <span className="item-modified">{item.uploadedOn}</span>
            <span className="item-size">{item.size}</span>
            <span><button className="item-request search-box__button">Download</button></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollableList;
