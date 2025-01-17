import React from 'react';

const BackgroundAnimation = ({ children, imageUrl, opacity = 0.1, rotationDegree = 15, animationDuration = 20, patternSize = 150 }) => {
  return (
    <div className="pattern-background-wrapper">
      <div className="pattern-content">
        {children}
      </div>
      <style>
        {`
          .pattern-background-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: white;
          }

          .pattern-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            width: 100%;
          }

          .pattern-background-wrapper::before {
            content: '';
            position: fixed;
            top: -100%;  /* prevent undercoverage of background */
            left: -100%;  /* due to some weird angle */
            width: 300vw;  
            height: 300vh; /* prevent gaps in pattern*/
            background-image: url('${imageUrl}');
            background-repeat: repeat;
            background-size: ${patternSize}px ${patternSize}px;
            transform: rotate(${rotationDegree}deg);
            z-index: 0;
            animation: slidePattern ${animationDuration}s linear infinite;
            opacity: ${opacity};
            will-change: transform; /* optimize animation performance */
          }

          @keyframes slidePattern {
            0% {
              transform: rotate(${rotationDegree}deg) translateX(0);
            }
            100% {
              transform: rotate(${rotationDegree}deg) translateX(-33.33%); /* Adjusted for smoother loop */
            }
          }

          /* ensuring the content stays centered */
          .container {
            margin: 0 auto;
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundAnimation;