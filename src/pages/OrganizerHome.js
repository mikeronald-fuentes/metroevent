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

    useEffect(() => {
        // Fetch events when the component mounts
        fetchEvents();
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:3000/admin')
            .then(res => res.json())
            .then(data => {
                setRequests(data);
            })
            .catch(err => console.error(err));
    }, [user, navigate]);

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
            // Filter out events organized by the current user
            const filteredJoinEvents = joinEventsData.filter(event => event.event_organizer !== username);
            setJoinEvents(filteredJoinEvents);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
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

    return (
        <>
            <HeaderComponent />
            <div className="organizer-content">
                <div className="organizer-button-container">
                    <button class="notif">
                        <svg class="bell" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
                        Notifications
                        <div class="arrow">›</div>
                    </button>
                    <Button variant="contained" className="organizer-create-event" onClick={createEvent}
                    sx={{
                        backgroundColor: 'rgb(66, 66, 66)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'white',
                            color: 'black',
                        },
                    }}>
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
                                            <Button variant="contained" className="organizer-check" onClick={() => handleCheckEvent(event)}
                                            sx={{
                                                backgroundColor: 'green',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'grey',
                                                    color: 'white',
                                                },
                                            }}>Check</Button>
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
                                            <Button
                                                variant="contained"
                                                className="organizer-check"
                                                onClick={() => handleCheckUpcomingEvent(event)}
                                                sx={{
                                                    backgroundColor: 'green',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'grey',
                                                        color: 'white',
                                                    },
                                                }}
                                            >
                                                Check
                                            </Button>
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
                                            <Typography gutterBottom variant="h5" component="div">
                                                {event.event_name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {event.event_description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions className="organizer-card-actions">
                                            <Button variant="contained" className="organizer-check" onClick={() => handleCheckJoinEvent(event)}
                                            sx={{
                                                backgroundColor: 'green',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'grey',
                                                    color: 'white',
                                                },
                                            }}>Check</Button>
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
                        <CustomJoinModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent}/>
                    ) : isUpcomingEvent ? (
                        <CustomUpModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent}/>
                    ) : (
                        <CustomModal show={showModal} onHide={handleCloseModal} eventData={selectedEvent} />
                    )}
                </>
            )}
        </>
    );
}

