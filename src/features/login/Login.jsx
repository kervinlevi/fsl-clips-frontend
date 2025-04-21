import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../../assets/fsl-clips-logo.png';
import axios from 'axios';
import { useModal } from '../../common/ModalContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { openInfoModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      await openInfoModal({
        title: "Sign in failed",
        message: "Please fill in both email and password.",
      });
      return;
    }

    try {
      const body = { email, password }
      const response = await axios.post('http://localhost:1337/user/login', body);
      console.log(response)

      const { type, accessToken, refreshToken, user_id, username } = response.data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);

      if (type == 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/watch');
      }
    } catch (err) {
      console.error(err);
      await openInfoModal({
        title: "Sign in failed",
        message: err?.response?.data?.['error'] ?? "We're experiencing server issues. Try again later.",
      });
      return;
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-sky-blue flex flex-col items-center justify-center">
      <div className="w-100 flex items-center justify-center mb-4">
        <img src={logo} alt="FSL Clips Logo" className="h-16" />
      </div>
      <br/>

      <div className="bg-white p-8 rounded-lg shadow-lg w-100">
        <h2 className="text-3xl font-semibold text-center text-space-cadet mb-12">Sign in</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-space-cadet" htmlFor="email">Email Address</label>
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
          
          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-space-cadet" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-indigo-dye text-white font-semibold rounded-md hover:bg-indigo-dye focus:outline-none focus:ring-2 focus:ring-sky-blue cursor-pointer"
          >
            Sign in
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-space-cadet">
            Don't have an account?&nbsp;<a href="/register" className="text-indigo-dye hover:underline">Register here.</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;