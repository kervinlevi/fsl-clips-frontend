import React, { useState, useRef } from "react";
import api from "../../../api/api";
import { useModal } from "../../../common/ModalContext";

const AddClip = () => {
  const [descriptionPh, setDescriptionPh] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [videoPreview, setVideoPreview] = useState(null);
  const [clip, setClip] = useState(null);
  const { openInfoModal } = useModal();
  const formRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("description_ph", descriptionPh);
    formData.append("description_en", descriptionEn);
    formData.append("clip", clip);

    try {
      await api.post("/clip", formData, { headers });
      await openInfoModal({
        title: "Success",
        message: "Clip has been successfully uploaded.",
      });
      formRef.current.reset();
      setVideoPreview(null);
    } catch (err) {
      await openInfoModal({
        title: "Upload failed",
        message:
          err.response?.data?.["error"] ??
          "We're experiencing server issues. Try again later.",
      });
    }
  };

  const handleSelectVideo = (e) => {
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    setClip(selectedFile);

    // Load preview
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
      reader.onload = (readerEvent) => {
        setVideoPreview(readerEvent.target.result);
      };
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Add a Clip</h1>

      <div className="flex flex-row">
        <div className="w-2/3">
          <form ref={formRef} onSubmit={handleUpload} className="space-y-1">
            <div>
              <input
                id="clipFile"
                type="file"
                accept="video/*"
                onChange={handleSelectVideo}
                className="block w-full text-sm text-space-cadet file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-dye file:text-white hover:file:bg-indigo-dye cursor-pointer"
                required
              />
            </div>
            <br />
            <div>
              <label
                className="block text-sm font-medium text-space-cadet"
                htmlFor="descriptionPh"
              >
                Description (in Filipino)
              </label>
              <textarea
                id="descriptionPh"
                rows="4"
                placeholder="What phrase are you teaching? Write here in Filipino."
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setDescriptionPh(e.target.value)}
                required
              />
            </div>
            <br />
            <div>
              <label
                className="block text-sm font-medium text-space-cadet"
                htmlFor="descriptionEn"
              >
                Translation (in English)
              </label>
              <textarea
                id="descriptionEn"
                rows="4"
                placeholder="Translate your text in English."
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setDescriptionEn(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
            >
              Upload clip
            </button>
          </form>
        </div>

        <div className="flex w-1/5 ml-6 h-fill items-center">
          {videoPreview && (
            <video
              className="aspect-9/16 rounded-lg size-fit cursor-pointer"
              src={videoPreview}
              type="video/mp4"
              muted
              playsInline
              controls
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddClip;
