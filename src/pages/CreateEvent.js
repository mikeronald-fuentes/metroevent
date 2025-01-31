
import React, { useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { Button, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom"; // Importing useNavigate hook
import "./CreateEvent.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateEvent() {
    const navigate = useNavigate();
    const location = useLocation();
    const username = location.state.username;

    const [eventDetails, setEventDetails] = useState({
        organizer: username,
        eventType: "",
        eventName: "",
        description: "",
        limit: "",
        location: "",
        date: "",
        time: ""
    });
    const [message, setMessage] = useState('');
    setEventDetails['username'] = username;
    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(value);
        setEventDetails({ ...eventDetails, [name]: value });
    };

    // Function to handle time input changes
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        // Format time as HH:MM:SS
        const formattedTime = value;
        setEventDetails({ ...eventDetails, [name]: formattedTime });
    };

    // Function to handle event submission
    const handleSubmit = async () => {
        try {
            console.log("Submitting event:", eventDetails);
            const response = await axios.post('http://localhost:3000/addevent', eventDetails);
            console.log("Server response:", response.data);
            if (response.data.message === 'Event added successfully') {
                toast.success("Event added successfully"); 
                setTimeout(() => {
                    navigate('/organizer');
                }, 2000);
            } else {
                toast.error("Failed to add event");
                setMessage('Failed to add event');
            }
        } catch (error) {
            console.error('Error adding event:', error);
            if (error.response) {
                toast.error(`Server responded with status code: ${error.response.status}`);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                toast.error(`No response received from server: ${error.request}`);
            } else {
                toast.error(`Error setting up request: ${error.message}`);
            }
            toast.error('Error adding event. Please try again later.');
        }
    };    
    
    // Function to navigate back to the previous page
    const handleCancel = () => {
        navigate(-1); // Navigating back
    };

    return (
        <>
            <HeaderComponent />
            <div className="content">
                <h1>Create new event</h1>
                <div className="info-row">
                    <div className="info-column">
                        <h3>Event type</h3>
                        <input
                            className="input"
                            placeholder="Event type"
                            name="eventType"
                            value={eventDetails.eventType}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="info-column">
                        <h3>Participant Limit</h3>
                        <input
                            className="input"
                            placeholder="Limit"
                            name="limit"
                            value={eventDetails.limit}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <ToastContainer position="top-right" />
                <div className="information">
                    <div className="info-row">
                        <div className="info-column">
                            <h3>Organizer</h3>
                            <input
                                className="input"
                                name="organizer"
                                placeholder={username}
                                value={eventDetails.username}
                                onChange={handleInputChange}
                                disabled={true}
                            />
                        </div>
                        <div className="info-column">
                            <h3>Location</h3>
                            <input
                                className="input"
                                placeholder="Location"
                                name="location"
                                value={eventDetails.location}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-column">
                            <h3>Event Name</h3>
                            <input
                                className="input"
                                placeholder="Event Name"
                                name="eventName"
                                value={eventDetails.eventName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-column">
                            <h3>Date</h3>
                            <input
                                type="date"
                                className="input"
                                placeholder="Date"
                                name="date"
                                value={eventDetails.date}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="info-row">
                        <div className="info-column">
                            <h3>Description</h3>
                            <input
                                className="input2"
                                placeholder="Description"
                                name="description"
                                value={eventDetails.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="info-column">
                            <h3>Time</h3>
                            <input
                                type="time"
                                className="input"
                                placeholder="Time"
                                name="time"
                                value={eventDetails.time}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="buttonCont">
                    <Button
                        sx={{ width: '450px', marginRight: '20px', color: 'white', backgroundColor: 'rgb(52, 104, 192)', height: '50px' }}
                        onClick={handleSubmit}
                    >
                        Post Event
                    </Button>
                    <Button
                        sx={{ width: '450px', marginRight: '20px', color: 'black', backgroundColor: '#d3d3d3' }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>
                {message && <div>{message}</div>}
            </div>
        </>
    );
}

