import React, { useRef, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import _ from "lodash";
import LoadingScreen from "../../common/LoadingScreen";

const WatchClips = () => {
  const navigate = useNavigate();
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const clipsLengthRef = useRef(0);
  const lastClipsRef = useRef([]);

  
  const fetchRandomClips = async () => {
    const exclude = encodeURIComponent(JSON.stringify(lastClipsRef.current));
    const url = `/randomClips?exclude=${exclude}`;

    try {
      const response = await api.get(url);

      // Remember most recent clips so they can be excluded next fetch
      // This will only exclude the most recently fetched clips not all previously fetch clips
      const newClips = response.data.clips;
      lastClipsRef.current = _.map(newClips, (clip) => clip.clip_id);

      // Append newly fetched clips
      setClips((currentClips) => [...currentClips, ...newClips]);
      clipsLengthRef.current = clips.length;
      if (currentIndex == -1) setCurrentIndex(0);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error fetching clips");
      console.error("Error fetching clips: ", err);
      setLoading(false);
    }
  };

  // Fetch clips from backend
  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);

    fetchRandomClips();
  }, []);

  // Handle video play/pause
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        if (idx === currentIndex) {
          vid.play().catch(() => {});
        } else {
          vid.pause();
          vid.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const showPreviousClip = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNextClip = () => {
    if (currentIndex + 1 < clips.length) {
      setCurrentIndex(currentIndex + 1);

      // Fetch random clips when index is near the end
      if (currentIndex > clips.length - 3) {
        fetchRandomClips();
      }
    }
  };

  // On mount, disable scroll
  // On unmount, reset this behavior
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleMenuClick = () => {
    navigate("/profile");
  };

  const handleSwipeTap = () => {
    if (currentIndex >= 0 && currentIndex < clips.length) {
      const video = videoRefs.current[currentIndex];
      if (!video) return;

      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  };

  const handleSwipe = useSwipeable({
    onSwipedUp: () => showNextClip(),
    onSwipedDown: () => showPreviousClip(),
    onTap: () => handleSwipeTap(),
    preventScrollOnSwipe: true,
    preventDefaultTouchmoveEvent: false,
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <div
      {...handleSwipe}
      className="bg-sky-blue relative overflow-auto touch-none"
    >
      <LoadingScreen isVisible={loading} />
      <div
        style={{
          height: `${clips.length * 100}vh`,
          'min-height': "100vh",
          width: "100vw",
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
        className="flex flex-col items-center justify-center transition-transform duration-500 ease-out"
      >
        {clips.map((clip, index) => (
          <div key={index} className="relative center">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              style={{
                height: "100vh",
                width: "56.25vh",
              }}
              src={`http://localhost:1337/${clip.video_url}`}
              poster={`http://localhost:1337/${clip.thumbnail_url}`}
              className="object-cover object-center md:rounded-lg bg-sky-blue cursor-all-scroll"
              muted
              playsInline
              loop
              controls={false}
              type="video/mp4"
            />

            <div className="absolute bottom-0 left-0 w-full md:p-4 pl-4 pr-24 pb-24 pt-24 z-10 bg-gradient-to-t from-black/70 to-transparent md:rounded-b-lg">
              <h3 className="text-white text-lg font-semibold mb-1 line-clamp-3">
                {clip.description_ph}
              </h3>

              {/* Don't show description_en if it's empty or if it's the same as description_ph */}
              {clip.description_en.trim() !== "" &&
                clip.description_en !== clip.description_ph && (
                  <p className="text-white text-sm italic mb-1 line-clamp-3">
                    {clip.description_en}
                  </p>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom right buttons */}
      <div className="fixed bottom-8 right-4 md:right-8 flex flex-col items-center space-y-4">
        <button
          onClick={showPreviousClip}
          disabled={currentIndex <= 0}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer transition-bg duration-100 disabled:cursor-not-allowed disabled:bg-white"
        >
          <span className="text-2xl">↑</span>
        </button>

        <button
          onClick={showNextClip}
          disabled={clips.size > 0 && currentIndex < clips.size - 1}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer transition-bg duration-100 disabled:cursor-not-allowed"
        >
          <span className="text-2xl">↓</span>
        </button>
      </div>


      {/* Top left menu */}
      <div className="fixed md:left-8 top-8 left-4">
        <button
          onClick={handleMenuClick}
          className="bg-white h-12 w-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer flex items-center justify-center transition-opacity duration-100"
        >
          <img
            src="/ic-profile.svg"
            alt="Edit profile"
            className="size-8 object-fill"
          />
        </button>
      </div>
    </div>
  );
};

export default WatchClips;
