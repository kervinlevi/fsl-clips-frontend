import React, { useRef, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import _ from "lodash";
import LoadingScreen from "../../common/LoadingScreen";
import { useModal } from "../../common/ModalContext";

const WatchClips = () => {
  const navigate = useNavigate();
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const clipsLengthRef = useRef(0);
  const lastClipsRef = useRef([]);
  const quizShowing = useRef(false);
  const { openInfoModal } = useModal();

  const fetchRandomClips = async () => {
    const exclude = encodeURIComponent(JSON.stringify(lastClipsRef.current));
    const url = `/randomClips?exclude=${exclude}`;

    try {
      const response = await api.get(url);

      // Remember most recent clips so they can be excluded next fetch
      // This will only exclude the most recently fetched clips not all previously fetch clips
      const newClips = response.data.clips;
      lastClipsRef.current = _.uniq(_.map(newClips, (clip) => clip.clip_id));
      localStorage.setItem("lastClips", JSON.stringify(lastClipsRef.current));

      // Append newly fetched clips
      setClips((currentClips) => {
        const updatedClips = [...currentClips, ...newClips];
        clipsLengthRef.current = updatedClips.length;
        return updatedClips;
      });
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

    console.log("Fetching first clips");

    try {
      const savedLastClips = JSON.parse(localStorage.getItem("lastClips"));
      if (_.isArray(savedLastClips)) {
        lastClipsRef.current = savedLastClips;
      }
    } catch (err) {
      console.log("Failed to retrieve savedLastClips");
    }
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

  const handleTapQuizOption = async ({ selected, options }) => {
    console.log(`Test ${JSON.stringify(selected)}`);

    // Record quiz attempt
    try {
      const formData = new FormData();
      formData.append("correct", selected.correct);

      const response = await api.post("/quizAttempt", formData);
      console.log(`Quiz attempt recorded: ${response}`);
    } catch (err) {
      console.error("Quiz attempt not recorded:", err);
    }

    // Show if user is correct or not through a modal
    if (selected.correct == true) {
      await openInfoModal({
        title: "Correct!",
        message: `You answered the quiz correctly! It's "${selected.description_ph}"`,
      });
    } else {
      const correctOption = _.find(options, (option) => option.correct == true);
      await openInfoModal({
        title: "Wrong answer",
        message: `The correct answer is "${correctOption.description_ph}"`,
      });
    }
    window.location.reload();
  };

  const showPreviousClip = () => {
    if (quizShowing.current) {
      return;
    }

    if (currentIndex > 0) {
      quizShowing.current = clips[currentIndex - 1].quiz == true;
      setCurrentIndex(currentIndex - 1);
    }
  };

  const showNextClip = () => {
    if (quizShowing.current) {
      return;
    }

    if (currentIndex + 1 < clips.length) {
      quizShowing.current = clips[currentIndex + 1].quiz == true;
      setCurrentIndex(currentIndex + 1);

      if (_.last(clips)?.quiz == true) {
        return;
      }

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
    if (quizShowing.current) {
      return;
    }

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
          minHeight: "100vh",
          width: "100vw",
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
        className="flex flex-col items-center justify-center transition-transform duration-500 ease-out"
      >
        {clips.map((clip, index) => (
          <div
            key={index}
            className={`relative center ${
              clip.quiz ? "bg-space-cadet/80" : ""
            } md:rounded-lg`}
            style={{
              height: "100vh",
              width: "56.25vh",
            }}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              style={{
                height: "100vh",
                width: "56.25vh",
                transform:
                  clip.quiz == true
                    ? "scale(0.8) translateY(-4vh)"
                    : "scale(1)",
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

            {!clip.quiz && (
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
            )}
            {clip.quiz && (
              <h3 className="absolute top-0 p-4 text-white text-2xl font-semibold mb-1 center w-full text-center">
                Quiz Time!
              </h3>
            )}

            {clip.quiz && (
              <div className="absolute bottom-0 left-0 w-full md:p-4 pl-4 pr-24 pb-24 pt-24 z-10 bg-gradient-to-t from-black/70 to-transparent md:rounded-b-lg flex flex-col gap-2">
                {clip.options.map((option, index) => (
                  <button
                    key={`option-${index}`}
                    onClick={() =>
                      handleTapQuizOption({
                        selected: option,
                        options: clip.options,
                      })
                    }
                    className="bg-white px-4 py-2 text-sm text-start w-full rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer transition-bg duration-100 z-50"
                  >
                    {option.description_ph}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom right buttons */}
      <div className="fixed bottom-8 right-4 md:right-8 flex flex-col items-center space-y-4">
        <button
          onClick={showPreviousClip}
          disabled={currentIndex <= 0 || quizShowing.current}
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer transition-bg duration-100 disabled:cursor-not-allowed disabled:bg-white"
        >
          <span className="text-2xl">↑</span>
        </button>

        <button
          onClick={showNextClip}
          disabled={
            (clips.size > 0 && currentIndex < clips.size - 1) ||
            quizShowing.current
          }
          className="bg-white p-4 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer transition-bg duration-100 disabled:cursor-not-allowed disabled:bg-white"
        >
          <span className="text-2xl">↓</span>
        </button>
      </div>

      {/* Top left menu */}
      <div className="fixed md:left-8 top-8 left-4">
        <button
          onClick={handleMenuClick}
          className="bg-white h-12 w-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer flex items-center justify-center transition-bg duration-100"
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
