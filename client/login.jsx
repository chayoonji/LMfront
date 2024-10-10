import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';

// 백엔드 API URL을 환경 변수에서 가져옴
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const { login, setIsAdmin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/login`, {
        userId,
        password,
      });

      if (response.data.success) {
        login(userId);
        setIsAdmin(response.data.isAdmin); // isAdmin 상태 업데이트
        alert('로그인 성공');
      } else {
        alert('로그인 실패');
      }
    } catch (error) {
      alert('로그인 에러 발생');
    }
  };

  return (
    <div className="main-container">
      <div className="login-wrapper">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} id="login-form">
          <input
            type="text"
            name="userId"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-container">
            <input type="submit" value="로그인" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
