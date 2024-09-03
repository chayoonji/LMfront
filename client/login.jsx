import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, {
        userId,
        password,
      });

      login(); // 로그인 상태를 Context에 저장
      alert('Logged in successfully');
    } catch (error) {
      if (error.response) {
        alert(`Error logging in: ${error.response.data.message}`);
      } else {
        alert('Error logging in');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
};

export default Login;
