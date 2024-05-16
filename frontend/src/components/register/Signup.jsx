import React, { useState } from "react";
import './Signup.scss';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('');

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('https://autoservice-k7ez.onrender.com/register',
            {
                username,
                password,
            })
            .then(result => {
                setMessage('ลงทะเบียนผู้ใช้งานสำเร็จ')
                setError('');
                setUsername('');
                setPassword('');
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                    setMessage('');
                }
                else {
                    setError('เกิดข้อผิดพลาดในการลงทะเบียน')
                    setMessage('');
                }
            })
    }

    return (
        <div className="register">
            <div>
                <div className="title-register">Add User</div>
                <form onSubmit={handleSubmit} className="register-form">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={password}
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="message-form">{message}</div>
                    <div className="error-form">{error}</div>
                    <button type="submit" className="button-register">
                        ADD
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;