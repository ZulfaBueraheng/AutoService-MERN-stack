import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://autoservice-k7ez.onrender.com/login', { username, password })
      .then(result => {
        const { token } = result.data;
        if (token) {
          axios.post('https://autoservice-k7ez.onrender.com/verify-token', { token })
            .then(response => {
              const { isValid, username } = response.data;
              if (isValid) {
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                onLogin();
                navigate('/home', { state: { id: username } });
              } else {
                setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
              }
            })
            .catch(err => {
              setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            });
        } else {
          setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      });
  };

  return (
    <div className="login">
      <div>
        <div className="title-login">LOGIN</div>
        <form onSubmit={handleSubmit} className="login-form">
          <label>Username</label>
          <input
            type="text"
            autoComplete="off"
            name="username"
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="error-form">{message}</div>

          <button type="submit" className="button-login">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
};

export default Login