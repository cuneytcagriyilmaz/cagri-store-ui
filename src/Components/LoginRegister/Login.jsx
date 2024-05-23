import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from 'react-router-dom';
import './styles.css';
import BaseNavbar from '../BaseNavbar';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/auth/login', {
                email,
                password
            });
            console.log(response.data);
            setLoginStatus(response.data);
            if (response.data === 'Admin login successful' || response.data === 'User login successful') {
                onLogin(response.data.includes('Admin') ? 'Admin' : 'User');

                localStorage.setItem('auth', btoa(`${email}:${password}`));
                localStorage.setItem('userEmail', email);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Invalid email or password');
            } else {
                toast.error('An error occurred. Please try again later.');
            }
        }
    };

    if (loginStatus === 'Admin login successful') {
        return <Navigate to="/admin" />;
    } else if (loginStatus === 'User login successful') {
        return <Navigate to="/user" />;
    }

    return (
        <div className="container">
            <BaseNavbar />
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input type="text" id="email" name="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
