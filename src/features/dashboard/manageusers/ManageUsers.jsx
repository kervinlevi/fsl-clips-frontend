import React from 'react';

const users = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@email.com',
    type: 'learner',
    dateRegistered: '2025-03-11',
  },
  {
    id: '2',
    username: 'admin1',
    email: 'admin1@email.com',
    type: 'admin',
    dateRegistered: '2025-03-10',
  },
  // Add more sample users as needed
];

const ManageUsers = () => {
  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
  };

  const handleDelete = (id) => {
    alert(`Delete user with ID: ${id}`);
  };

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
            <tr key={user.id} className="border-b-2 border-neutral-200 hover:bg-neutral-200">
              <td className="py-3 px-4">{user.id}</td>
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.dateRegistered}</td>
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