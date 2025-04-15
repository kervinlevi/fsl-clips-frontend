import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUser = ({user_id}) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUser = async () => {
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }

    try {
      const response = await axios.get(`http://localhost:1337/user/${user_id}`, { headers });
      console.log(`fetchUser ${JSON.stringify(response.data.user)}`);
      setUser(response.data.user);
      setUsername(response.data.user.username);
      setEmail(response.data.user.email);
      setIsAdmin(response.data.user.type === 'admin')
      setLoading(false);
    } catch (err) {
      console.error('Upload error:', err)
      setLoading(false);
      setError(`Error fetching user ${user_id}`);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const headers = { 
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }

    const type = isAdmin? 'admin': 'learner'
    if (user.username === username && user.email === email && user.type === type) {
      setLoading(false);
      alert(`No data updated.`);
      return
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('type', type);
    try {
      console.error('Updating...')
      const response = await axios.post(`http://localhost:1337/user/${user_id}`, formData, { headers });
      console.error('Got response')
      console.log(`editUser ${JSON.stringify(response)}`);
      setLoading(false);
      alert(`User was successfully updated.`);
    } catch (err) {
      console.error('Updating error:', err)
      setLoading(false);
      setError(`Error updating user ${user_id}`);
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
    fetchUser();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
      return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Edit user</h1>

      <form onSubmit={updateUser} className="space-y-1">
        <div className="w-200">
          <label className="block text-sm font-medium text-space-cadet" htmlFor="user_id">User ID</label>
          <input
              id="user_id"
              value={user_id}
              disabled={true}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
        </div>
        <br />
        <div className="w-200">
          <label className="block text-sm font-medium text-space-cadet" htmlFor="username">Username</label>
          <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
        </div>
        <br/>
        <div className="w-200">
          <label className="block text-sm font-medium text-space-cadet" htmlFor="email">Email</label>
          <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
        </div>
        <br/>
        <div className="w-200">
          <label className="inline-flex items-center space-x-2 text-space-cadet">
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="form-checkbox h-5 w-5"
            />
            <span className="text-space-cadet">Admin</span>
          </label>
        </div>
        <br />
        <div className="w-200 text-sm font-medium text-space-cadet">
          User registered on {new Date(user.date_added).toLocaleString(undefined, dateFormatting)}.
        </div>
        <button
            type="submit"
            className="w-200 py-3 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue"
          >
            Update user
        </button>
      </form>
    </div>
  );
};

export default EditUser;