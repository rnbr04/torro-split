import React from 'react';
import linkedinIcon from '/linkedin_white.png';
import githubIcon from '/github-mark-white.svg';
import './aboutCard.css';

const AboutCard = ({ name, image, qualifications, details, linkedinUrl, githubUrl }) => {
  return (
    <div className="about-card">
      <img src={image} alt={name} className="card-image" />
      <h2 className="card-name">{name}</h2>
      <p className="card-qualifications">{qualifications}</p>
      <p className="card-details">{details}</p>
      <div className="social-links">
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-button" id='linkedin-btn'>
          <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
        </a>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="social-button" id='github-btn'>
          <img src={githubIcon} alt="GitHub" className="social-icon" />
        </a>
      </div>
    </div>
  );
};

export default AboutCard;