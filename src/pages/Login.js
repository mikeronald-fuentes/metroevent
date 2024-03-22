import React from "react";
import logo from '../images/logo.png';
import { Typography, TextField, Button } from "@mui/material";
import "./LoginStyles.css";

function Login(){

  const handleOnClick = () => {

  }

  return (
    <div className="container">
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
        <TextField variant="outlined" placeholder="Enter your username" className="input1" />
        <Typography variant="body1" className="passtag">Password</Typography>
        <TextField variant="outlined" placeholder="Enter your password" className="input2" type="password"/>
        <br />
        <Button variant="contained" className="loginbutton"><Typography>Log in</Typography></Button>
      </div>
    </div>
  );
}

export default Login;