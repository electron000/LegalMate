import React from 'react';
import Lottie from 'lottie-react';
import lawScaleAnimationData from './lawscale.json';
const LawScaleAnimation = ({ width = 400, height = 350 }) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const animationStyle = {
    width: width,
    height: height,
  };

  return (
    <div style={containerStyle}>
      <Lottie
        animationData={lawScaleAnimationData}
        loop={true}     
        autoplay={true}  
        style={animationStyle}
      />
    </div>
  );
};

export default LawScaleAnimation;