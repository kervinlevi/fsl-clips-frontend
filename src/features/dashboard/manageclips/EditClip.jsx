import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditClip = ({clip_id}) => {
  const [descriptionPh, setDescriptionPh] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [clip, setClip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClip = async () => {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }

    try {
      const response = await axios.get(`http://localhost:1337/clip/${clip_id}`, { headers });
      console.log(`fetchClip ${JSON.stringify(response.data.clip)}`);
      setDescriptionPh(response.data.clip.description_ph);
      setDescriptionEn(response.data.clip.description_en);
      setClip(response.data.clip);
      setLoading(false);
    } catch (err) {
      console.error('Upload error:', err)
      setLoading(false);
      setError(`Error fetching clip ${clip_id}`);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }
    const formData = new FormData();
    formData.append('description_ph', descriptionPh)
    formData.append('description_en', descriptionEn)

    try {
      const response = await axios.post(`http://localhost:1337/clip/${clip_id}`, formData, { headers });
      alert(`Update success`);
      console.log(`Update success: ${response}`)
    } catch (err) {
      alert(`Update failed`);
      console.error('Update error:', err)
    }
  };

  const dateFormatting = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  let firstFetch = true
  useEffect(() => { 
    if (!firstFetch) return

    firstFetch = false
    setLoading(true)
    fetchClip();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Edit Clip</h1>
      
      <div className="flex flex-row">
        <div className="flex w-1/5 mr-6 h-fill items-center">
            {clip &&(
                <video
                    className="aspect-9/16 rounded-lg size-fit"
                    src={`http://localhost:1337/${clip.video_url}`}
                    type="video/mp4"
                    muted
                    playsInline
                    controls
                    />
            )}
        </div>
        <div className="w-2/3">
            <form onSubmit={handleUpdate} className="space-y-1">
            <div className="w-full">
            <label className="block text-sm font-medium text-space-cadet" htmlFor="clip_id">Clip ID</label>
            <input
                id="clip_id"
                value={clip_id}
                disabled={true}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
            </div>
            <br />
            <div>
            <label className="block text-sm font-medium text-space-cadet" htmlFor="descriptionPh">Description (in Filipino)</label>
            <textarea 
                id="descriptionPh" 
                rows="4" 
                placeholder="What phrase are you teaching? Write here in Filipino." 
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={e => setDescriptionPh(e.target.value)} 
                value={descriptionPh}
                required
            />
            </div>
            <br/>
            <div>
            <label className="block text-sm font-medium text-space-cadet" htmlFor="descriptionEn">Translation (in English)</label>
            <textarea 
                id="descriptionEn" 
                rows="4" 
                placeholder="Translate your text in English." 
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                onChange={e => setDescriptionEn(e.target.value)}
                value={descriptionEn}
                required
            />
            </div>
            <br />
            {clip && (
            <div className="w-full text-sm font-medium text-space-cadet">
                Clip added by user {clip.added_by} on {new Date(clip.date_added).toLocaleString(undefined, dateFormatting)}.
            </div>
            )}
            <button
                type="submit"
                className="w-full py-3 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
                Update clip details
            </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default EditClip;