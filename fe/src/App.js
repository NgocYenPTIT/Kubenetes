import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const urlBackend = 'http://localhost:80/'; 

  useEffect(() => {
    // Gọi API từ backend (vẫn dùng endpoint cũ)
    axios.get(urlBackend)
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi:', error);
        setError('Không thể kết nối đến server!');
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend React App</h1>
        <div className="message-box">
          <h2>Thông tin người dùng:</h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div>
              <p>ID: {userData.id}</p>
              <p>Tên: {userData.name}</p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;