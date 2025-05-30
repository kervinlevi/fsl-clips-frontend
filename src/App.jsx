import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./features/login/Login";
import Registration from "./features/register/Registration";
import Dashboard from "./features/dashboard/Dashboard";
import WatchClips from "./features/home/WatchClips";
import EditProfile from "./features/profile/EditProfile";
import "./App.css";
import { ModalProvider } from "./common/ModalContext";

function App() {
  return (
    <ModalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/watch" element={<WatchClips />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<EditProfile />} />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
