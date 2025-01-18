import React from 'react';
import './backgroundAnimation.css';

const BackgroundAnimation = ({ children, imageUrl, opacity = 0.1, animationDuration = 20, patternSize = 150 }) => {
  return (
    <div
      className="pattern-background-wrapper"
      style={{
        '--background-url': `url(${imageUrl})`,
        '--opacity': opacity,
        '--animation-duration': `${animationDuration}s`,
        '--pattern-size': `${patternSize}px`,
      }}
    >
      <div className="pattern-content">
        {children}
      </div>
    </div>
  );
};

export default BackgroundAnimation;
