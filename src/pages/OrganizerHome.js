import React, { useState, useEffect } from 'react';
import HeaderComponent from './HeaderComponent';
import { Typography, Button } from '@mui/material';
import { Card, CardActions, CardContent } from '@mui/material';
import './OrganizerHome.css';
import { useNavigate } from 'react-router-dom';
import CustomModal from './Components/CustomModal';
import CustomJoinModal from './Components/CustomJoinModal';
import CustomUpModal from './Components/CustomUpModal';
import { useAuth } from '../Hooks/Authorization';
import UserProfile from './UserProfile';
import CustomNotifModal from './Components/CustomNotifModal';
import ApproveUsersModal from './Components/CustomApproveUsers';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function OrganizerHome() {
    const navigate = useNavigate();
    const [myEvents, setMyEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [joinEvents, setJoinEvents] = useState([]);
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isJoinEvent, setIsJoinEvent] = useState(false);
    const [isUpcomingEvent, setIsUpcomingEvent] = useState(false);
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showApproveUsersModal, setShowApproveUsersModal] = useState(false);
    const [eventId, setEventId] = useState('');
    const [cancelEvent, setCancelEvent] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(UserProfile.getUsername());
        } else {
            navigate('/login');
        }
    }, [user]);
    
    useEffect(() => {
        if (username) {
            fetchEvents();
        }
    }, [username, cancelEvent]);
    
    const fetchEvents = async () => {
        try {
            const myEventsResponse = await fetch(`http://localhost:3000/events/${username}`);
            const myEventsData = await myEventsResponse.json();
            setMyEvents(myEventsData);
    
            const upcomingEventsResponse = await fetch(`http://localhost:3000/events/attended/${username}`);
            const upcomingEventsData = await upcomingEventsResponse.json();
            setUpcomingEvents(upcomingEventsData);
    
            const joinEventsResponse = await fetch(`http://localhost:3000/events?username=${username}`);
            const joinEventsData = await joinEventsResponse.json();
            
            const filteredJoinEvents = joinEventsData.filter(event => event.event_organizer.toLowerCase() !== username.toLowerCase());
            setJoinEvents(filteredJoinEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    
    const handleCancelEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:3000/events/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventId })
            });
            if (response.ok) {
                setCancelEvent(prevState => !prevState);
                toast.success('Event canceled successfully');
            } else {
                toast.error('Failed to cancel event');
            }
        } catch (error) {
            console.error('Failed to cancel event:', error);
            toast.error('Failed to cancel event');
        }
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

    const handleViewUserRegistrations = (eventid) => {
        setShowApproveUsersModal(true);
        setEventId(eventid);
    };

    const handleNotificationClick = () => {
        setShowNotificationModal(true);
        fetchNotifications(username);
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
        navigate('/createevent', { state: { username: username } });
    };

    return (
        <>
            <HeaderComponent />
            <div className="organizer-content">
                <div className="organizer-button-container">
                    <Button className="notif" onClick={handleNotificationClick}>
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
                                            <Button variant="contained" className="organizer-check" onClick={() => handleViewUserRegistrations(event.event_id)}>Registrations</Button>
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
                        <CustomJoinModal show={showModal} onHide={() => setShowModal(false)} eventData={selectedEvent} username={username}/>
                    ) : isUpcomingEvent ? (
                        <CustomUpModal show={showModal} onHide={() => setShowModal(false)} eventData={selectedEvent} username={username}/>
                    ) : (
                        <CustomModal
                            show={showModal}
                            onHide={() => setShowModal(false)}
                            eventData={selectedEvent}
                            username={username}
                            onCancel={handleCancelEvent}
                        />
                    )}
                </>
            )}
            {showNotificationModal && (
                <CustomNotifModal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} notifications={notifications} username={username}/>
            )}
            {showApproveUsersModal && (
                <ApproveUsersModal show={showApproveUsersModal} onHide={() => setShowApproveUsersModal(false)} eventid={eventId} username={username}/>
            )}
        </>
    );
}