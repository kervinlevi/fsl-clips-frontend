import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        const response = await axios.get('http://localhost:1337/users', { headers });
        setUsers(response.data.users);
        console.log(response)
        setLoading(false);  // Stop the loading spinner
      } catch (err) {
        setError('Error fetching users');
        setLoading(false);  // Stop loading if there’s an error
      }
  };

    const handleEdit = (id) => {
      alert(`Edit user with ID: ${id}`);
    };

    const handleDelete = (id) => {
      alert(`Delete user with ID: ${id}`);
    };

    // Fetch users when the component mounts
    // Empty dependency array means this runs only once when the component mounts
    let firstFetch = true
    useEffect(() => { 
      if (!firstFetch) return

      firstFetch = false
      setLoading(true)
      fetchUsers();
    }, []); 

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

  return (
    <div>
      <h1 className="text-3xl font-bold mt-6 mb-6">Manage Users</h1>
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-space-cadet">
            <th className="py-3 px-4 text-left text-space-cadet">ID</th>
            <th className="py-3 px-4 text-left text-space-cadet">Username</th>
            <th className="py-3 px-4 text-left text-space-cadet">Email</th>
            <th className="py-3 px-4 text-left text-space-cadet">Date Added</th>
            <th className="py-3 px-4 text-left text-space-cadet">Account type</th>
            <th className="py-3 px-4 text-left text-space-cadet">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="border-b-2 border-neutral-200 hover:bg-neutral-200">
              <td className="py-3 px-4">{user.user_id}</td>
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.date_added}</td>
              <td className="py-3 px-4">{user.type}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="text-indigo-dye hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
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

export default ManageUsers;