import React, { useState } from 'react';
import axios from 'axios';
import './UploadButton.css'; // CSS 파일을 임포트합니다.

const UploadButton = () => {
  const [userId, setUserId] = useState('');
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [files, setFiles] = useState(null); // 파일 상태 추가

  const API_URL = import.meta.env.VITE_API_URL; // API URL을 환경 변수에서 가져옴

  const handleSetUserId = async () => {
    try {
      const response = await axios.post(`${API_URL}/set-user-id`, {
        userId,
      });
      console.log(response.data.message);
      setIsUserIdSet(true);
      setSuccessMessage('User ID has been set successfully!');
      resetData();
    } catch (error) {
      console.error('Error setting user ID:', error);
      setSuccessMessage('Failed to set User ID. Please try again.');
    }
  };

  const resetData = () => {
    setUserId('');
    setFiles(null); // 파일 상태 초기화
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files); // 선택한 파일들 상태 저장
  };

  const handleUpload = async () => {
    if (!isUserIdSet) {
      console.error('User ID not set.');
      setSuccessMessage('Please set the User ID first.');
      return;
    }

    const formData = new FormData();
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append('files', file); // 파일들을 FormData에 추가
      });
    }

    try {
      const response = await axios.post(
        `${API_URL}/upload/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // multipart/form-data로 설정
          },
        }
      );
      console.log(response.data);
      setSuccessMessage('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      setSuccessMessage('File upload failed. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">JSON 파일 업로드</h1>
      <div className="upload-input-group">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="upload-input"
        />
        <button onClick={handleSetUserId} className="upload-button">
          Set User ID
        </button>
      </div>
      <input
        type="file"
        multiple
        onChange={handleFileChange} // 파일 선택 핸들러
        className="upload-input"
      />
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default UploadButton;
