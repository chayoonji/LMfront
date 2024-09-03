import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState('');

  const API_URL = import.meta.env.VITE_API_URL; // API URL을 환경 변수에서 가져옴

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert('Please verify your company email first');
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, {
        name,
        userId,
        companyEmail,
        password,
        verificationCode,
      });
      setRegistrationSuccess(true);
      alert('User registered successfully');
    } catch (error) {
      alert('Error registering user');
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      await axios.post(`${API_URL}/verify-company-email`, {
        companyEmail,
      });
      alert('Verification code sent successfully');
    } catch (error) {
      alert('Error sending verification code');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post(`${API_URL}/verify-code`, {
        companyEmail,
        verificationCode,
      });
      if (response.data.success) {
        setIsVerified(true);
        alert('Company email verified successfully');
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      alert('Error verifying code');
    }
  };

  const handleCheckDuplicate = async () => {
    try {
      const response = await axios.post(`${API_URL}/check-duplicate`, {
        userId,
      });
      if (response.data.exists) {
        setIdCheckResult('User ID is already taken.');
        setIdCheckResultStyle({ color: 'red' });
      } else {
        setIdCheckResult('User ID is available.');
        setIdCheckResultStyle({ color: 'green' });
      }
    } catch (error) {
      alert('Error checking user ID');
    }
  };

  const [idCheckResultStyle, setIdCheckResultStyle] = useState({});

  const inputStyle = { width: '100%', marginBottom: '20px', height: '40px' };
  const buttonStyle = {
    marginLeft: '10px',
    height: '40px',
    marginTop: '-10px',
  };
  const reducedMarginStyle = {
    width: '100%',
    marginBottom: '10px',
    height: '40px',
  };
  const borderRadiusStyle = { borderRadius: '5px' };

  if (registrationSuccess) {
    window.location.reload();
  }

  return (
    <div className="login-wrapper">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={handleCheckDuplicate}
          style={{ ...buttonStyle, ...borderRadiusStyle }}
        >
          Check Duplicate
        </button>
        <span style={idCheckResultStyle}>{idCheckResult}</span>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <input
            type="text"
            name="companyEmail"
            placeholder="Company Email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          <button
            type="button"
            onClick={handleSendVerificationCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            Send Verification Code
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <input
            type="text"
            name="verificationCode"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            style={{ ...reducedMarginStyle, ...borderRadiusStyle }}
          />
          <button
            type="button"
            onClick={handleVerifyCode}
            style={{ ...buttonStyle, ...borderRadiusStyle }}
          >
            Verify Code
          </button>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={reducedMarginStyle}
        />
        <div className="button-container">
          <input type="submit" value="Register" style={{ height: '40px' }} />
        </div>
      </form>
    </div>
  );
};

export default Register;
