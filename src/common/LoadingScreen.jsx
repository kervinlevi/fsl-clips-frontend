import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ isVisible = true }) => {
  const fadeDuration = 300;
  const [show, setShow] = useState(isVisible);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setFadeOut(false);
    } else {
      setFadeOut(true);
      const timeout = setTimeout(() => {
        setShow(false);
      }, fadeDuration);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!show) return null;

  return (
    <div className={`absolute h-screen w-full flex flex-col justify-center items-center z-50 transition-opacity duration-${fadeDuration} ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
        <div className="animate-spin">
            <img
              data-testid="spinner-img"
              src="/ic-spinner.svg"
              alt="spinner"
              className="size-20 object-fill"
            /></div>
    </div>
  );
};

export default LoadingScreen;
