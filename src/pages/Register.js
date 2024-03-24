import "./registerStyles.css";
import { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import logo from '../images/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = () => {
        // Perform validation checks
        if (formData.password !== formData.confirmPassword) {
            toast.error('Password does not match.');
            return;
        }
        console.log(formData.firstName);
        console.log(formData.lastName);
        // Send data to backend for registration
        fetch('http://localhost:3000/registeraccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data); // Log the response for debugging
            // Optionally, you can show a success message to the user
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            toast.error('Failed to register');
        });
    };

    return(
        <div className='registerScreen'>
            <div className="blue">
                <img src={logo} alt="Logo" className="logo" />
                <Typography variant="h4" className="tag">Register Now</Typography>
                <Typography variant="body1" className="tag2">Enter your credentials to create your account</Typography>
            </div>
            <ToastContainer position="top-right" />
            <div className='right'>
                <div className="register">
                    <Typography variant="h4" className="tag3">Register</Typography>
                    <Typography variant="body1" className="subtag3">Secure access</Typography>
                    <Typography variant="h4" className="tag4">Register</Typography>
                    <Typography variant="body1" className="usernametag">Username</Typography>
                    <TextField variant="outlined" placeholder="Enter your username" className="inputUsername" name="username" value={formData.username} onChange={handleInputChange} />
                    <Typography variant="body1" className="usernametag">First Name</Typography>
                    <TextField variant="outlined" placeholder="Enter your first name" className="inputFirstName" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    <Typography variant="body1" className="usernametag">Last Name</Typography>
                    <TextField variant="outlined" placeholder="Enter your last name" className="inputLastName" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    <Typography variant="body1" className="passtag">Password</Typography>
                    <TextField variant="outlined" placeholder="Enter your password" className="inputPassword" type="password" name="password" value={formData.password} onChange={handleInputChange} />
                    <Typography variant="body1" className="passtag">Confirm your Password</Typography>
                    <TextField variant="outlined" placeholder="Re-enter your password" className="inputConfirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                    <br />
                    <Button variant="contained" className="loginbutton" onClick={handleRegister}><Typography>Register</Typography></Button>
                </div>
            </div>
        </div>
    );
};

export default Register;
