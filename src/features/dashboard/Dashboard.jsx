import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ManageClips from './manageclips/ManageClips'; 
import logo from './../../assets/fsl-clips-logo.png';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('ManageClips');

  const handleLogout = () => {
    alert('You have been logged out');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-sky-blue text-white pt-5 pb-5">

        <div className="w-full flex-col pl-5 pr-5 text-center">
            <img src={logo} alt="FSL Clips Logo" />
            <h2 className="text-2xl font-bold mb-16">Admin Dashboard</h2>
        </div>

        <ul>
          <li className={`p-5 ${activePage === 'ManageClips' ? 'bg-indigo-dye' : ''}`}>
            <Link
              to="#"
              onClick={() => setActivePage('ManageClips')}
              className={`text-lg font-bold ${activePage === 'ManageClips' ? 'text-white' : 'text-indigo-dye'}`}
            >
              Clips
            </Link>
          </li>
          <li className={`p-5 ${activePage === 'ManageUsers' ? 'bg-indigo-dye' : ''}`}>
            <Link
              to="#"
              onClick={() => setActivePage('ManageUsers')}
              className={`text-lg font-bold ${activePage === 'ManageUsers' ? 'text-white' : 'text-indigo-dye'}`}
            >
              Users
            </Link>
          </li>
          <li className={`p-5 ${activePage === 'Settings' ? 'bg-indigo-dye' : ''}`}>
            <Link
              to="#"
              onClick={() => setActivePage('Settings')}
              className={`text-lg font-bold ${activePage === 'Settings' ? 'text-white' : 'text-indigo-dye'}`}
            >
              Settings
            </Link>
          </li>
          <li className='p-5'>
            <Link
              to="/login"
              onClick={() => handleLogout()}
              className='text-lg font-bold text-indigo-dye'
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activePage === 'ManageClips' && <ManageClips />}
        
      </div>
    </div>
  );
};

export default Dashboard;
