import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import _ from 'lodash';

function Home() {
  const navigate = useNavigate();
  const [clips, setClips] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  let lastClips = [];

  const fetchRandomClips = async () => {
    const exclude = encodeURIComponent(JSON.stringify(lastClips));
    const url = `http://localhost:1337/randomClips?exclude=${exclude}`;

    try {
      const response = await axios.get(url);

      // Remember most recent clips so they can be excluded next fetch
      const newClips = response.data.clips
      lastClips = _.map(newClips, (clip) => clip.clip_id);

      // Append newly fetched clips
      setClips(currentClips => [...currentClips, ...newClips]);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error fetching clips");
      console.error("Error fetching clips: ", err);
      setLoading(false);
    }
  };

  const handleNavigateUp = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleNavigateDown = () => {
    if (index + 1 < clips.length) {
      setIndex(index + 1);

      // Fetch random clips when index is near the end
      if (index > clips.length - 3) {
        fetchRandomClips();
      }
    }
  };

  const handleMenuClick = () => {
    alert("You have been logged out");
    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    alert("You have been logged out");
    navigate("/login");
  };

  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);
    fetchRandomClips();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-sky-blue flex flex-col justify-between relative">
      <div className="flex w-full flex-1 relative items-center justify-center relative">
        <video
          className="h-screen object-cover aspect-9/16 rounded-lg bg-space-cadet"
          src={
            clips.length > 0
              ? `http://localhost:1337/${clips[index].video_url}`
              : null
          }
          poster={
            clips.length > 0
              ? `http://localhost:1337/${clips[index].thumbnail_url}`
              : null
          }
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
          disabled={clips.size > 0 && index > 0}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet cursor-pointer"
        >
          <span className="text-2xl">↑</span>
        </button>

        <button
          onClick={handleNavigateDown}
          disabled={clips.size > 0 && index < clips.size - 1}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet cursor-pointer"
        >
          <span className="text-2xl">↓</span>
        </button>
      </div>

      <div className="absolute top-8 left-8">
        <button
          onClick={handleMenuClick}
          className="bg-white h-12 w-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-space-cadet cursor-pointer"
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
