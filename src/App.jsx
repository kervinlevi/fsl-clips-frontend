import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./features/login/Login";
import Registration from "./features/register/Registration";
import Dashboard from "./features/dashboard/Dashboard";
import WatchClips from "./features/home/WatchClips";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/watch" element={<WatchClips />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
