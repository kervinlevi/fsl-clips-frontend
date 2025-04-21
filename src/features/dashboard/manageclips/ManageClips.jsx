import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import _ from "lodash";
import LoadingScreen from "../../../common/LoadingScreen";
import { useModal } from "../../../common/ModalContext";
import ErrorScreen from "../../../common/ErrorScreen";

const ManageClips = ({ handleAddClip, handleEditClip }) => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { openConfirmModal } = useModal();

  const fetchClips = async () => {
    try {
      const response = await api.get("/clips");
      setClips(response.data.clips);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error fetching clips");
      console.error("Error fetching clips: ", err);
      setLoading(false);
    }
  };

  const dateFormatting = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const handleDelete = async (clip_id) => {
    const confirmed = await openConfirmModal({
      title: `Delete`,
      message: `Are you sure you want to delete clip ${clip_id}?`,
      yes: "Yes",
      no: "No"
    });
    if (!confirmed) {
      return;
    }

    try {
      const response = await api.delete(`/clip/${clip_id}`);
      setClips((previousClips) =>
        _.filter(previousClips, (clip) => clip.clip_id !== clip_id)
      );

      console.log(response);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error deleting clip");
      setLoading(false);
    }
  };

  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);
    fetchClips();
  }, []);

  return (
    <div>
      <div className="w-full flex flex-row justify-between relative py-4">
        <LoadingScreen isVisible={loading} />
        {error && (
          <ErrorScreen message="Clips couldn't be retrieved at the moment. Pleast try again later." />
        )}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Manage Clips</h1>
        </div>
        <button
          onClick={handleAddClip}
          type="button"
          className="flex-col w-100 py-4 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
        >
          Add a clip
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-space-cadet">
            <th className="py-3 px-4 text-left text-space-cadet">Thumbnail</th>
            <th className="py-3 px-4 text-left text-space-cadet">ID</th>
            <th className="py-3 px-4 text-left text-space-cadet">
              Description
            </th>
            <th className="py-3 px-4 text-left text-space-cadet">Date Added</th>
            <th className="py-3 px-4 text-left text-space-cadet">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clips.map((clip) => (
            <tr
              key={clip.clip_id}
              className="border-b-2 border-neutral-200 hover:bg-neutral-200"
            >
              <td className="py-3 px-4 w-40">
                <img
                  src={`http://localhost:1337/${clip.thumbnail_url}`}
                  alt={`Thumbnail for video ${clip.clip_id}`}
                  className="w-20 h-20 object-cover object-top rounded-md"
                />
              </td>
              <td className="py-3 px-4 w-10">{clip.clip_id}</td>
              <td className="py-3 px-4 w-100">
                <div className="truncate w-80">{clip.description_ph}</div>
                <div className="truncate w-80">{clip.description_en}</div>
              </td>
              <td className="py-3 px-4 w-80">
                {new Date(clip.date_added).toLocaleString(
                  undefined,
                  dateFormatting
                )}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEditClip(clip.clip_id)}
                  className="text-indigo-dye hover:underline mr-4 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(clip.clip_id)}
                  className="text-rose-red hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageClips;
