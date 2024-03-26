
import React, { useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { Typography, Button, TextField, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook
import "./CreateEvent.css";
import axios from "axios";

export default function CreateEvent() {
    const navigate = useNavigate(); // Getting the navigate function
    const [eventDetails, setEventDetails] = useState({
        organizer: "",
        eventType: "",
        eventName: "",
        description: "",
        limit: "",
        location: "",
        date: "",
        time: ""
    });
    const [message, setMessage] = useState('');

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails({ ...eventDetails, [name]: value });
    };

    // Function to handle time input changes
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        // Format time as HH:MM:SS
        const formattedTime = value + ':00';
        setEventDetails({ ...eventDetails, [name]: formattedTime });
    };

    // Function to handle event submission
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/addevent', eventDetails);
            console.log(eventDetails);
            if (response.data.message === 'Event added successfully') {
                alert('Event added successfully');
                // Redirect to a success page or any other route
                navigate('/organizer');
            } else {
                setMessage('Failed to add event');
            }
        } catch (error) {
            console.error('Error adding event:', error);
            if (error.response) {
                // The request was made and the server responded inth a status code
                // that falls out of the range of 2xx
                console.error('Server responded with status code:', error.response.status);
                console.error('Response data:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received from server:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
            }
            // Display an appropriate error message to the user
            alert('Error adding event. Please try again later.');
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
                <div className="information">
                    <div className="info-row">
                        <div className="info-column">
                            <h3>Organizer</h3>
                            <input
                                className="input"
                                placeholder="Organizer"
                                name="organizer"
                                value={eventDetails.organizer}
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
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
                    {/* Call handleCancel function when the "Cancel" button is clicked */}
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

