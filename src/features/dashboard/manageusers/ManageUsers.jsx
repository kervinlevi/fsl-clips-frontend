import React, { useState, useEffect } from "react";
import _ from "lodash";
import api from "../../../api/api";
import { useModal } from "../../../common/ModalContext";
import LoadingScreen from "../../../common/LoadingScreen";
import ErrorScreen from "../../../common/ErrorScreen";

const ManageUsers = ({ handleEditUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { openInfoModal, openConfirmModal } = useModal();

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");
      setUsers(response.data.users);
      console.log(response);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const handleEdit = (user_id) => {
    handleEditUser(user_id);
  };

  const handleDelete = async (user) => {
    const confirmed = await openConfirmModal({
      title: "Delete user",
      message: `Are you sure you want to delete user ${user.username}?`,
      yes: "Yes",
      no: "No",
      warning: true,
      closeOnOverlayClick: true
    });
    if (!confirmed) {
      return;
    }
    try {
      const response = await api.delete(`/user/${user.user_id}`);
      setUsers((previousUsers) =>
        _.filter(previousUsers, (thisUser) => thisUser.user_id !== user.user_id)
      );

      console.log(response);
      setLoading(false);
      setError(null);
    } catch (err) {
      await openInfoModal({
        title: "Delete failed",
        message: err.response?.data?.["error"] ?? err,
      });
      setLoading(false);
    }
  };

  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);
    fetchUsers();
  }, []);

  const dateFormatting = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return (
    <div>
      <div className="w-full flex flex-row justify-between relative py-4">
        <LoadingScreen isVisible={loading} />
        {error && (
          <ErrorScreen
            message="Users couldn't be retrieved at the moment. Pleast try again later."
          />
        )}
        <h1 className="text-3xl font-bold">Manage Users</h1>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="border-b-2 border-space-cadet">
            <th className="py-3 px-4 text-left text-space-cadet">ID</th>
            <th className="py-3 px-4 text-left text-space-cadet">Username</th>
            <th className="py-3 px-4 text-left text-space-cadet">Email</th>
            <th className="py-3 px-4 text-left text-space-cadet">Date Added</th>
            <th className="py-3 px-4 text-left text-space-cadet">
              Account type
            </th>
            <th className="py-3 px-4 text-left text-space-cadet">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.user_id}
              className="border-b-2 border-neutral-200 hover:bg-neutral-200"
            >
              <td className="py-3 px-4">{user.user_id}</td>
              <td className="py-3 px-4">{user.username}</td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                {new Date(user.date_added).toLocaleString(
                  undefined,
                  dateFormatting
                )}
              </td>
              <td className="py-3 px-4">{user.type}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleEdit(user.user_id)}
                  className="text-indigo-dye hover:underline mr-4 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-rose-red hover:underline disabled:text-space-cadet/70 cursor-pointer disabled:cursor-not-allowed"
                  disabled={localStorage.getItem("user_id") == user.user_id}
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
