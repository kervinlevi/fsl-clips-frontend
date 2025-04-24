import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ManageClips from "./manageclips/ManageClips";
import ManageUsers from "./manageusers/ManageUsers";
import logo from "./../../assets/fsl-clips-logo.png";
import AddClip from "./manageclips/AddClip";
import EditUser from "./manageusers/EditUser";
import EditClip from "./manageclips/EditClip";
import EditSettings from "./settings/EditSettings";
import { useModal } from "../../common/ModalContext";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("ManageClips");
  const [activePageParam, setActivePageParam] = useState(null);
  const { openConfirmModal } = useModal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmed = await openConfirmModal({
      title: "Sign out",
      message: "Are you sure you want to sign out?",
      yes: "Yes",
      no: "No",
    });
    if (!confirmed) {
      return;
    }
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleEditUser = (user_id) => {
    setActivePageParam(user_id);
    setActivePage("EditUser");
  };

  const handleAddClip = () => {
    setActivePage("AddClip");
  };

  const handleEditClip = (clip_id) => {
    setActivePageParam(clip_id);
    setActivePage("EditClip");
  };

  const highlightClips = () => {
    return (
      activePage === "ManageClips" ||
      activePage === "AddClip" ||
      activePage === "EditClip"
    );
  };

  const highlightUsers = () => {
    return activePage === "ManageUsers" || activePage === "EditUser";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-sky-blue text-white pt-5 md:pb-5 flex-shrink-0">
        <div className="w-full md:flex-col flex pl-5 pr-5 text-center justify-center">
          <img src={logo} alt="FSL Clips Logo" className="mx-auto mb-4 w-64 object-contain" />
          <h2 className="text-2xl mt-4 font-bold md:mt-0  md:mb-16">Admin Dashboard</h2>
        </div>

        <ul className="flex md:flex-col justify-evenly md:justify-start">
          <li className={`p-5 ${highlightClips() ? "bg-indigo-dye" : ""}`}>
            <Link
              to="#"
              onClick={() => setActivePage("ManageClips")}
              className={`text-lg font-bold ${
                highlightClips() ? "text-white" : "text-indigo-dye"
              }`}
            >
              Clips
            </Link>
          </li>
          <li className={`p-5 ${highlightUsers() ? "bg-indigo-dye" : ""}`}>
            <Link
              to="#"
              onClick={() => setActivePage("ManageUsers")}
              className={`text-lg font-bold ${
                highlightUsers() ? "text-white" : "text-indigo-dye"
              }`}
            >
              Users
            </Link>
          </li>
          <li
            className={`p-5 ${
              activePage === "EditSettings" ? "bg-indigo-dye" : ""
            }`}
          >
            <Link
              to="#"
              onClick={() => setActivePage("EditSettings")}
              className={`text-lg font-bold ${
                activePage === "EditSettings" ? "text-white" : "text-indigo-dye"
              }`}
            >
              Settings
            </Link>
          </li>
          <li className="p-5">
            <Link
              to="#"
              onClick={() => handleLogout()}
              className="text-lg font-bold text-indigo-dye"
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activePage === "ManageClips" && (
          <ManageClips
            handleAddClip={() => handleAddClip()}
            handleEditClip={(clip_id) => handleEditClip(clip_id)}
          />
        )}
        {activePage === "AddClip" && <AddClip />}
        {activePage === "ManageUsers" && (
          <ManageUsers handleEditUser={(user_id) => handleEditUser(user_id)} />
        )}
        {activePage === "EditUser" && <EditUser user_id={activePageParam} />}
        {activePage === "EditClip" && <EditClip clip_id={activePageParam} />}
        {activePage === "EditSettings" && <EditSettings />}
      </div>
    </div>
  );
};

export default Dashboard;
