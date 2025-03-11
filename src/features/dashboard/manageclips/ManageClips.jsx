import React from 'react';

const videos = [
  {
    id: '1',
    thumbnail: '/src/test-data1-thumbnail.png',
    description: 'Thank you very much',
    dateAdded: '2025-03-10',
  },
  {
    id: '2',
    thumbnail: '/src/test-data2-thumbnail.png',
    description: 'Happy birthday',
    dateAdded: '2025-03-11',
  },
  // Add more sample videos as needed
];

const ManageClips = () => {
  const handleEdit = (id) => {
    alert(`Edit video with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete video with ID: ${id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Manage Clips</h1>
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-space-cadet">
            <th className="py-3 px-4 text-left text-space-cadet">Thumbnail</th>
            <th className="py-3 px-4 text-left text-space-cadet">ID</th>
            <th className="py-3 px-4 text-left text-space-cadet">Description</th>
            <th className="py-3 px-4 text-left text-space-cadet">Date Added</th>
            <th className="py-3 px-4 text-left text-space-cadet">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="border-b-2 border-neutral-200 hover:bg-neutral-200">
              <td className="py-3 px-4">
                <img
                  src={video.thumbnail}
                  alt={`Thumbnail for video ${video.id}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </td>
              <td className="py-3 px-4">{video.id}</td>
              <td className="py-3 px-4">{video.description}</td>
              <td className="py-3 px-4">{video.dateAdded}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEdit(video.id)}
                  className="text-indigo-dye hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="text-rose-red hover:underline"
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