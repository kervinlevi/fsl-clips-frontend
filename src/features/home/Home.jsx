import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const videos = [
    "/src/test-data1.mp4",
    "/src/test-data2.mp4"
  ]
  const navigate = useNavigate();
  const [videoIndex, setVideoIndex] = useState(0);
  
  const handleNavigateUp = () => {
    if (videoIndex == 0) {
        setVideoIndex(videos.length - 1);
    } else {
        setVideoIndex(videoIndex - 1);
    }
  };

  const handleNavigateDown = () => {
    setVideoIndex((videoIndex + 1) % videos.length);
  };

  const handleMenuClick = () => {
    alert('You have been logged out');
    navigate('/login');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    alert('You have been logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col justify-between relative">
      <div className="flex w-full flex-1 relative items-center justify-center relative">
            <video
            className="h-screen object-cover aspect-9/16 rounded-lg bg-space-cadet"
            src={videos[videoIndex]}
            type="video/mp4"
            autoPlay
            loop
            muted
            playsInline
            />
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col items-center space-y-4">
        <button
          onClick={handleNavigateUp}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet"
        >
          <span className="text-2xl">↑</span>
        </button>

        <button
          onClick={handleNavigateDown}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet"
        >
          <span className="text-2xl">↓</span>
        </button>
      </div>

      <div className="absolute top-8 left-8">
        <button
          onClick={handleMenuClick}
          className="bg-white h-12 w-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {false && (
        <div className="absolute top-16 left-8 bg-white p-4 rounded-lg shadow-sm space-y-2">
          <button onClick={handleViewProfile}>View Profile</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
}

export default Home;
