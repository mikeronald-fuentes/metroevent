import "./registerStyles.css";
import "./LoginStyles.css";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../images/logo.png';
import UserProfile from './UserProfile';

const Register = () => {
    const navigate = useNavigate();

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
        if(formData.username === '' || formData.firstName === '' || formData.lastName === ''|| formData.password === ''){
            toast.error('Please fill all the information needed.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Password does not match.');
            return;
        }

        fetch('http://localhost:3000/registeraccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                toast.success(data.message);
                setTimeout(() => {
                    UserProfile.setUsername(data.user_name);
                    setFormData({
                        username: '',
                        firstName: '',
                        lastName: '',
                        password: '',
                        confirmPassword: ''
                    });
                toast.success('Logging in');
                }, 1000);
                setTimeout(() => {
                    navigate('/homeuser');
                }, 2000);
            } else if (data.error) {
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
                <Typography variant="h4" className="tag">Log in to your account</Typography>
                <Typography variant="body1" className="tag2">Enter your credentials to access your account</Typography>
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
                    <div style={{marginTop: '20px'}}>
                    <Typography variant="body1">Already have an account? <Link to="/login"><span style={{color: 'blue'}}>Log in</span></Link></Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
