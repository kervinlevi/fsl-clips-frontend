import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./../../assets/fsl-clips-logo.png";
import api from "../../api/api";

function EditProfile() {
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      alert("Please fill in username and email.");
      return;
    }
    if (user.username === username && user.email === email && password === "") {
      setLoading(false);
      alert(`No data updated.`);
      return;
    }

    try {
      const body =
        password !== "" ? { username, email, password } : { username, email };
      const response = await api.post("/self/update", body);
      console.log(response);
      alert("Updated profile successfully!");
      setPassword("");
    } catch (err) {
      console.error(err);
      setPassword("");
      setLoading(false);
      alert(err.response?.data?.["error"] ?? err);
    }
  };

  const handleLogOut = () => {
    alert("You have been logged out");
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
      alert(err.response?.data?.["error"] ?? err);
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
        <div className="flex mb-4">
          <button
            onClick={handleLogOut}
            className="ml-auto flex items-center text-sm p-2 bg-space-cadet/10 hover:bg-space-cadet/20 rounded-md justify-between gap-2 text-space-cadet font-medium cursor-pointer transition-bg duration-100"
          >
            <img
              src="/ic-logout.svg"
              alt="Sign out"
              className="size-5 object-fill"
            />
            <span>Sign out</span>
          </button>
        </div>

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
      <div className="fixed top-8 left-8">
        <button 
        className="bg-white h-12 rounded-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-dye cursor-pointer flex items-center transition-bg duration-100"
        onClick={handleReturn}>
          <span className="text-2xl md:pl-4 md:pr-0 pl-4 pr-4">←</span>
          <span className="text-sm md:pl-2 md:pr-4 md:inline hidden">Resume watching</span>
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
