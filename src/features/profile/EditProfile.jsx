import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./../../assets/fsl-clips-logo.png";
import api from "../../api/api";
import { useModal } from "../../common/ModalContext";

function EditProfile() {
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { openInfoModal, openConfirmModal } = useModal();

  const fetchSelf = async () => {
    try {
      const response = await api.get(`/self`);
      console.log(`fetchSelf ${JSON.stringify(response.data.user)}`);
      setUser(response.data.user);
      setUsername(response.data.user.username);
      setEmail(response.data.user.email);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching self", err);
      setLoading(false);
      setError("Error fetching self");
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !username) {
      setLoading(false);
      await openInfoModal({
        title: "Update profile failed",
        message: "Please fill in username and email.",
      });
      return;
    }
    if (user.username === username && user.email === email && password === "") {
      setLoading(false);
      await openInfoModal({
        title: "Update profile failed",
        message: "No changes to update.",
      });
      return;
    }

    try {
      const body =
        password !== "" ? { username, email, password } : { username, email };
      const response = await api.post("/self/update", body);
      console.log(response);
      await openInfoModal({ message: "Updated profile successfully!" });
      setPassword("");
    } catch (err) {
      console.error(err);
      setPassword("");
      setLoading(false);
      await openInfoModal({
        title: "Update profile failed",
        message: err.response?.data?.["error"] ?? err,
      });
    }
  };

  const handleLogOut = async () => {
    const confirmed = await openConfirmModal({
      title: "Sign out",
      message: "Are you sure you want to sign out?",
      yes: "Yes",
      no: "No"
    });
    if (!confirmed) {
      return
    }
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleReturn = () => {
    navigate("/watch", { replace: true });
  };

  const handleDelete = async () => {
    try {
      const isConfirmed = window.confirm(
        "Do you want to delete your own account?"
      );
      if (!isConfirmed) {
        return;
      }

      const isConfirmedAgain = window.confirm(
        "This action will log you out and you won't be able to use your account anymore. Are you sure?"
      );
      if (!isConfirmedAgain) {
        return;
      }

      await api.delete("/self/delete");
      console.log("Account has been deleted.");
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Error deleting profile.");
    }
  };

  let firstFetch = true;
  useEffect(() => {
    if (!firstFetch) return;

    firstFetch = false;
    setLoading(true);
    fetchSelf();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen min-w-screen bg-sky-blue flex flex-col items-center justify-center p-8">
      <div className="flex items-center justify-center mb-4 w-1/3 min-w-100">
        <img src={logo} alt="FSL Clips Logo" className="h-16 object-contain" />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3 min-w-100">
        <h2 className="text-3xl font-semibold text-center text-space-cadet mb-12">
          Edit profile
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-space-cadet"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Set new username"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-space-cadet"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Set new username"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-sm font-medium text-space-cadet"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Set new password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
          >
            Update profile
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleDelete}
            className="font-small text-rose-red hover:underline cursor-pointer"
          >
            Request account deletion
          </button>
        </div>
      </div>

      {/* Top left menu */}
      <div className="w-screen pl-4 pr-4 fixed flex justify-between top-8">
        <button
          className="bg-white md:h-12 md:w-auto h-12 w-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer flex items-center transition-bg duration-100"
          onClick={handleReturn}
        >
          <span className="text-2xl md:pl-4 md:pr-0 w-full md:w-auto">←</span>
          <span className="text-sm md:pl-2 md:pr-4 md:inline hidden">
            Resume watching
          </span>
        </button>

        <button
          onClick={handleLogOut}
          className="bg-white h-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer flex items-center transition-bg duration-100 gap-4 pl-4 pr-4"
        >
          <span className="text-sm">Sign out</span>
          <img
            src="/ic-logout.svg"
            alt="Sign out"
            className="size-5 object-fill"
          />
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
