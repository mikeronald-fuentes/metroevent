import React, { useState } from 'react';
import logo from '../images/logo.png';
import { Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./LoginStyles.css";
import axios from "axios";
import { useAuth } from '../Hooks/Authorization';
import UserProfile from './UserProfile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      if (response.data.success) {
        toast.success('Login successful');
        login(response.data);
        UserProfile.setUsername(username);
        UserProfile.setUserType(response.data.user_type);
        setTimeout(() => {
        if (response.data.user_type === 0) {
          navigate('/homeuser');
        } else if (response.data.user_type === 1) {
          navigate('/organizer');
        } else if (response.data.user_type === 2) {
          navigate('/admin');
        }
      }, 2000);
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('Invalid username or password');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRegisterClick = (event) => {
    navigate('/register');
  };

  return (
    <div className="contained">
            <ToastContainer position="top-right" />
      <div className="blue">
        <img src={logo} alt="Logo" className="logo" />
        <Typography variant="h4" className="tag">Log in to your account</Typography>
        <Typography variant="body1" className="tag2">Enter your credentials to access your account</Typography>
      </div>
      <div className="white">
        <Typography variant="h4" className="tag3">Log in</Typography>
        <Typography variant="body1" className="subtag3">Secure access</Typography>
        <Typography variant="h4" className="tag4">Log in</Typography>
        <Typography variant="body1" className="usernametag">Username</Typography>
        <TextField
          variant="outlined"
          placeholder="Enter your username"
          className="input1"
          value={username}
          onChange={handleUsernameChange}
        />
        <Typography variant="body1" className="passtag">Password</Typography>
        <TextField
          variant="outlined"
          placeholder="Enter your password"
          className="input1"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <br />
        <Button variant="contained" className="loginbutton" onClick={handleLogin}>
          <Typography>Log in</Typography>
        </Button>
        {message && <div>{message}</div>}
        <br></br>
        <Typography> No Account? <Button variant='outline' onClick={handleRegisterClick}>Register</Button> </Typography>
      </div>
      
    </div>
  );
}

export default Login;