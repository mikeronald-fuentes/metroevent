import React, { useState, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import { Typography, Button } from '@mui/material';
import { Card, CardActions, CardContent } from '@mui/material';
import './OrganizerHome.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from './Components/CustomModal'; // Import CustomModal component
import CustomJoinModal from './Components/CustomJoinModal';
import CustomUpModal from './Components/CustomUpModal';
import { useAuth } from '../Hooks/Authorization';
import UserProfile from './UserProfile';
import CustomNotifModal from './Components/CustomNotifModal';

export default function OrganizerHome() {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]); // State for user's events
    const [upcomingEvents, setUpcomingEvents] = useState([]); // State for upcoming events
    const [joinEvents, setJoinEvents] = useState([]); // State for events user has joined
    const [username, setUsername] = useState(''); // State to store logged-in username
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const [selectedEvent, setSelectedEvent] = useState(null); // State to store selected event
    const [isJoinEvent, setIsJoinEvent] = useState(false); // State to check if it's a join event
    const [isUpcomingEvent, setIsUpcomingEvent] = useState(false); // State to check if it's an upcoming event
    const [requests, setRequests] = useState([]);
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]); // State for notifications
    const [showNotificationModal, setShowNotificationModal] = useState(false); // State to control notification modal visibility

    useEffect(() => {
        // Fetch events when the component mounts or when the username changes
        if (user) {
            setUsername(UserProfile.getUsername());
        } else {
            navigate('/login');
        }
    }, [user]);
    
    useEffect(() => {
        if (username) {
            fetchEvents();
            console.log("Fetching notifications...");
        }
    }, [username]);
    
    const fetchEvents = async () => {
        try {
            // Fetch user's events
            const myEventsResponse = await fetch(`http://localhost:3000/events/${username}`);
            const myEventsData = await myEventsResponse.json();
            setMyEvents(myEventsData);
    
            // Fetch upcoming events
            const upcomingEventsResponse = await fetch(`http://localhost:3000/events/attended/${username}`);
            const upcomingEventsData = await upcomingEventsResponse.json();
            setUpcomingEvents(upcomingEventsData);
    
            // Fetch join events
            const joinEventsResponse = await fetch(`http://localhost:3000/events?username=${username}`);
            const joinEventsData = await joinEventsResponse.json();
            
            // Filter out events organized by the current user (case-sensitive)
            const filteredJoinEvents = joinEventsData.filter(event => event.event_organizer.toLowerCase() !== username.toLowerCase());
            setJoinEvents(filteredJoinEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    

    const fetchNotifications = (username) => {
        fetch('http://localhost:3000/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setNotifications(data);
        })
        .catch(err => console.error(err));
    };
    
    const createEvent = () => {
        navigate('/createevent');
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCheckEvent = (event) => {
        setSelectedEvent(event);
        setIsJoinEvent(false);
        setIsUpcomingEvent(false);
        setShowModal(true);
    };

    const handleCheckJoinEvent = (event) => {
        setSelectedEvent(event);
        setIsJoinEvent(true);
        setIsUpcomingEvent(false);
        setShowModal(true);
    };

    const handleCheckUpcomingEvent = (event) => {
        setSelectedEvent(event);
        setIsJoinEvent(false);
        setIsUpcomingEvent(true);
        setShowModal(true);
    };

    const handleNotificationClick = () => {
        setShowNotificationModal(true); // Show the notification modal
        fetchNotifications(username); // Fetch notifications when the button is clicked
    };

    const handleCloseNotificationModal = () => {
        setShowNotificationModal(false); // Hide the notification modal
    };

    return (
        <>
            <HeaderComponent />
            <div className="organizer-content">
                <div className="organizer-button-container">
                    <Button className="notif" onClick={handleNotificationClick}>
                        {/* Add notification icon and text */}
                        Notifications
                    </Button>
                    <Button variant="contained" className="organizer-create-event" onClick={createEvent}>
                        <Typography>Create Event</Typography>
                    </Button>
                </div>
                {myEvents.length > 0 && (
                    <>
                        <h1>My Events</h1>
                        <div className="organizer-event-cards-wrapper">
                            <div className="organizer-upcoming-event">
                                {myEvents.map((event) => (
                                    <Card className="organizer-card" key={event.event_id}>
                                        <CardContent className="organizer-card-content">
                                            <Typography gutterBottom variant="h5" component="div">
                                                {event.event_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.event_description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions className="organizer-card-actions">
                                            <Button variant="contained" className="organizer-check" onClick={() => handleCheckEvent(event)}>Check</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {upcomingEvents.length > 0 && (
                    <>
                        <h1>Upcoming Events</h1>
                        <div className="organizer-event-cards-wrapper">
                            <div className="organizer-upcoming-event">
                                {upcomingEvents.map((event) => (
                                    <Card className="organizer-card" key={event.event_id}>
                                        <CardContent className="organizer-card-content">
                                            <Typography gutterBottom variant="h5" component="div">
                                                {event.event_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.event_description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions className="organizer-card-actions">
                                            <Button variant="contained" className="organizer-check" onClick={() => handleCheckUpcomingEvent(event)}>Check</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {joinEvents.length > 0 && (
                    <>
                        <h1>Join Events</h1>
                        <div className="organizer-event-cards-wrapper">
                            <div className="organizer-join-event">
                                {joinEvents.map((event) => (
                                    <Card className="organizer-card" key={event.event_id}>
                                        <CardContent className="organizer-card-content">
                                            <Typography gutterBottom variant="h5"component="div">
                                                {event.event_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.event_description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions className="organizer-card-actions">
                                            <Button variant="contained" className="organizer-check" onClick={() => handleCheckJoinEvent(event)}>Check</Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            {showModal && (
                <>
                    {isJoinEvent ? (
                        <CustomJoinModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent} username={username}/>
                    ) : isUpcomingEvent ? (
                        <CustomUpModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent} username={username}/>
                    ) : (
                        <CustomModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent} username={username} />
                    )}
                </>
            )}
            {showNotificationModal && (
                <CustomNotifModal show={showNotificationModal} onHide={handleCloseNotificationModal} notifications={notifications} username={username}/>
            )}
        </>
    );
}

