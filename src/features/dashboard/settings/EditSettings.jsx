import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

const EditSettings = () => {
  const [settings, setSettings] = useState({});
  const [quizEnabled, setQuizEnabled] = useState(false);
  const [clipsBeforeQuiz, setClipsBeforeQuiz] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    try {
      const response = await axios.get(`http://localhost:1337/settings`, {
        headers,
      });
      console.log(`fetchUser ${JSON.stringify(response.data)}`);
      setSettings(response.data);
      setQuizEnabled(response.data.quiz_enabled);
      setClipsBeforeQuiz(response.data.clips_before_quiz);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Upload error:", err);
      setLoading(false);
      setError(`Error fetching user ${user_id}`);
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    if (
      settings.quiz_enabled === quizEnabled &&
      settings.clips_before_quiz === clipsBeforeQuiz
    ) {
      setLoading(false);
      setError(null);
      alert(`No data updated.`);
      return;
    }

    const formData = new FormData();
    formData.append("quiz_enabled", quizEnabled);
    formData.append("clips_before_quiz", clipsBeforeQuiz);
    try {
      const response = await axios.post(
        `http://localhost:1337/settings`,
        formData,
        { headers }
      );
      console.log(`Edit settings ${JSON.stringify(response.data)}`);
      setSettings(response.data);
      setQuizEnabled(response.data.quiz_enabled);
      setClipsBeforeQuiz(response.data.clips_before_quiz);
      setLoading(false);
      alert(`Settings was successfully updated.`);
    } catch (err) {
      console.error("Updating error:", err);
      setLoading(false);
      setError(`Error updating settings.`);
    }
  };

  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);
    fetchSettings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Settings</h1>
      <form onSubmit={updateSettings} className="space-y-1">
        <div className="w-1/2">
          <label className="inline-flex items-center cursor-pointer w-1/2 justify-between">
            <input
              type="checkbox"
              checked={quizEnabled}
              className="sr-only peer"
              onChange={() => setQuizEnabled(!quizEnabled)}
            />
            <span className="text-sm font-medium text-space-cadet">
              Quiz Enabled
            </span>
            <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-blue rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-dye" />
          </label>
        </div>
        <br />
        <div className="w-1/2">
          <label
            className="block text-sm font-medium text-space-cadet"
            htmlFor="clipsBeforeQuiz"
          >
            Show quiz after how many clips
          </label>
          <input
            type="number"
            min="2"
            max="20"
            id="clipsBeforeQuiz"
            name="clipsBeforeQuiz"
            disabled={!quizEnabled}
            value={clipsBeforeQuiz}
            onChange={(e) => setClipsBeforeQuiz(_.toNumber(e.target.value))}
            required
            className="mt-2 w-1/2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-blue disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            placeholder="Enter your username"
          />
        </div>
        <br />
        <button
          type="submit"
          className="w-1/2 py-3 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
        >
          Update settings
        </button>
      </form>
    </div>
  );
};

export default EditSettings;
