import { useState, useEffect } from "react";
import { Typography, Button, Modal, DialogContent, Card, CardActions, CardContent } from "@mui/material";
import UserProfile from './UserProfile';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Review from './Components/CustomReviewModal';
import ViewReview from './Components/CustomViewReviewModal';
import ApproveUsersModal from './Components/CustomApproveUsers';
import CustomModal from './Components/CustomModal';
import CustomJoinModal from './Components/CustomJoinModal';
import CustomUpModal from './Components/CustomUpModal';
import CustomNotifModal from './Components/CustomNotifModal';
import { useAuth } from '../Hooks/Authorization';
import './OrganizerHome.css';


const OrganizerHome = () => {
    const [eventsDetails, setEventsDetails] = useState([]);
    const [requestedEvents, setRequestedEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pastevents, setPastEvents] = useState([]);
    const [username, setUsername] = useState(UserProfile.getUsername() || '');
    const [eventID, setEventID] = useState(null);
    const [eventReviews, setEventReviews] = useState({});
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);
    const [myEvents, setMyEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [joinEvents, setJoinEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isJoinEvent, setIsJoinEvent] = useState(false);
    const [isUpcomingEvent, setIsUpcomingEvent] = useState(false);
    const { user, logout } = useAuth();
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [showApproveUsersModal, setShowApproveUsersModal] = useState(false);
    const [eventId, setEventId] = useState('');
    const [cancelEvent, setCancelEvent] = useState(false);


    useEffect(() => {
        setUsername(UserProfile.getUsername());
        if (!username) {
            navigate('/login');
            return;
        }
        fetchingData();
        fetchNotifications(username);
        fetchReviewedEvents();
    }, [username, eventID]);

    const fetchReviewedEvents = () => {
        // Fetch the list of reviewed events for the current user
        fetch(`http://localhost:3000/reviewedevents?username=${username}`)
            .then(res => res.json())
            .then(data => {
                // Create a map of reviewed events
                const reviewedEventsMap = {};
                data.forEach(event => {
                    reviewedEventsMap[event.event_id] = true;
                });
                // Update the state with the reviewed events map
                setEventReviews(reviewedEventsMap);
            })
            .catch(err => console.error(err));
    };

    const fetchingData = async () => {
        try {
            // Fetch user's events
            const myEventsResponse = await fetch(`http://localhost:3000/events/${username}`);
            const myEventsData = await myEventsResponse.json();
            setMyEvents(myEventsData);
    
            // Fetch upcoming events
            const upcomingEventsResponse = await fetch(`http://localhost:3000/events/attended/${username}`);
            const upcomingEventsData = await upcomingEventsResponse.json();
            setUpcomingEvents(upcomingEventsData);

            fetch('http://localhost:3000/requestedevents',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            .then(res => res.json())
            .then(data => {
                setRequestedEvents(data);
            })
            .catch(err => console.error(err));
    
            // Fetch join events
            fetch('http://localhost:3000/joinevents',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            .then(res => res.json())
            .then(data => {
                setJoinEvents(data);
            })
            .catch(err => console.error(err));

            fetch('http://localhost:3000/requestedevents',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            })
            .then(res => res.json())
            .then(data => {
                setRequestedEvents(data);
            })
            .catch(err => console.error(err));

        } catch (error) {
            console.error('Error fetching events:', error);
        }

        fetch('http://localhost:3000/registeredevents',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setRegisteredEvents(data)
        })
        .catch(err => console.error(err));
        
        fetch('http://localhost:3000/pastevents')
            .then(res => res.json())
            .then(data => setPastEvents(data))
            .catch(err => console.error(err));
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

    const handleViewUserRegistrations = (eventid) => {
        setShowApproveUsersModal(true);
        setEventId(eventid);
    };
      
    const handleNotificationClick = () => {
        setShowNotificationModal(true);
        fetchNotifications(username);
    };

    const createEvent = () => {
        navigate('/createevent', { state: { username: username } });
    };

    // used when register button is clicked
    const handleRegisterEvent = (username, eventid, orgusername, event_name) => {
        fetch(`http://localhost:3000/registerevent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventid })
        })
        .then(res => res.json())
        .then(data => {
            sendNotificationToOrganizer(event_name, username, orgusername);
            fetchingData();
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
    };
    
    // handle style for the vote buttons in registered events
    const handleUpVoteJoinEvents = (eventid, username, index) => {
        if (eventsDetails[index].has_upvoted === 1) {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        } else {
            fetch(`http://localhost:3000/addupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid , username})
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };

    // handle style for the vote buttons in requested events
    const handleUpVoteRequested = (eventid, username, index) => {
        if (requestedEvents[index].has_upvoted === 1) {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        } else {
            fetch(`http://localhost:3000/addupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid , username})
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };

    // handle style for the vote buttons in requested events
    const handleUpVoteRegistered = (eventid, username, index) => {
        if (registeredEvents[index].has_upvoted === 1) {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        } else {
            fetch(`http://localhost:3000/addupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid , username})
            })
            .then(res => res.json())
            .then(data => {
                fetchingData();
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };
    

    // send notifications of organizer
    const sendNotificationToOrganizer = (event_name, username, orgusername) => {
        fetch('http://localhost:3000/sendnotificationuserregisterevent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({event_name, username, orgusername})
        })
        .then(res => res.json())
        .then(data => {
        })
        .catch(err => console.error(err));
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
    
    // format date
    const handleDate = (date) => {
        const timestamp = date;
        const dateObject = new Date(timestamp);

        let year = dateObject.getFullYear(); 
        let month = dateObject.getMonth() + 1;
        let day = dateObject.getDate(); 

        const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
        return formattedDate;
    };

    //format time
    const handleTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
    
        let hour = hours;
        let period = hour >= 12 ? 'PM' : 'AM';
    
        if (hour > 12) {
            hour -= 12;
        } else if (hour === 0) { 
            hour = 12;
        }
    
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        return formattedTime;
    }

    // Open Modal
    const handleOpenModal = (eventId) => {
        setEventID(eventId);
        setIsModalOpen(true);
    };

    //log out
    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    // Close Modal
    const handleCloseModal = () => {
        setEventID(null); // Reset the eventId state when the modal is closed
        setIsModalOpen(false);
        setIsModalReviewOpen(false);
    };

    const handleOpenReviewModal = (eventId) => {
        setEventID(eventId);
        setIsModalReviewOpen(true);
    };

    return (
        <div className='organizerHomeScreem'>
            <div className='header'>
                <div className='title'>Metro Events</div>
                <div className="notification-container">
                    
                </div>
                <div className='logout'>
                    <Button color='inherit' onClick={handleLogout}>
                        <Typography>
                            Log out
                        </Typography>
                    </Button>
                </div>
            </div> 
            <ToastContainer position="top-right" />
            <div className="organizer-content">
                <div className="organizer-button-container">
                    <Button className="notif" onClick={handleNotificationClick}>
                        Notifications
                    </Button>
                    <Button variant="contained" className="organizer-create-event" onClick={createEvent}>
                        <Typography>Create Event</Typography>
                    </Button>
                </div>
            </div>
            <div className='orgContainerEvents'>
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
                {joinEvents.length > 0 && (
                    <div className='joinEvents'>
                        <div className='txtUpcomming'>Join Event</div>
                        <div className='cards'>
                            {Array.isArray(joinEvents) && joinEvents.map((item, index)=> (
                                <div key={index} index={index} className='eventCards'>
                                    <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                                        <div style={{width:'100%', display: 'flex'}}>
                                            <div className='eventName'>{item.event_name}</div>
                                            <div className='count'>
                                                <span class="icon">&#x21e7;</span>{item.upvote_count}
                                            </div>
                                        </div>
                                        <div className='organizer'><i>by {item.event_organizer}</i></div>
                                        <div className='description'><span>Description: </span> {item.event_description}</div>
                                        <div className='type'><span>Type: </span> {item.event_type}</div>
                                        <div className='limit'><span>People Limit: </span> {item.event_participants_limit}</div>
                                        <div className='location'><span>Location: </span> {item.event_location}</div>
                                        <div className='date'><span>Date: </span> {handleDate(item.event_date)}</div>
                                        <div className='time' ><span>Time: </span>{handleTime(item.event_time)}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingTop: '7px' }}>
                                        <div style={{ marginRight: 'auto', marginBottom: '7px', paddingRight: '10px' }}>
                                            <Button 
                                                variant="contained" 
                                                className="btnAdmin" 
                                                style={{ backgroundColor: 'blue' }} 
                                                onClick={() => handleRegisterEvent(username, item.event_id, item.event_organizer, item.event_name)}
                                            >
                                                <Typography>Register</Typography>
                                            </Button>
                                        </div>
                                        <div style={{ marginRight: '10px', marginBottom: '7px' }}>
                                            <Button 
                                                variant="contained" 
                                                className="btnAdmin"
                                                style={{
                                                    backgroundColor: item.has_upvoted === 1 ? 'red' : 'green',
                                                    color:'white'
                                                }}
                                                onClick={() => handleUpVoteJoinEvents(item.event_id, username, index)}
                                            >
                                                <Typography>{item.has_upvoted === 1 ? 'Upvoted' : 'Upvote'}</Typography>
                                            </Button>
                                        </div>
                                        <div style={{ marginRight: '10px', marginBottom: '7px', marginRight: 'auto'}}>
                                            <Typography>
                                                {eventReviews[item.event_id] ? (
                                                    <Button variant='contained' disabled>
                                                        Reviewed
                                                    </Button>
                                                ) : (
                                                    <Button variant='contained' onClick={() => handleOpenModal(item.event_id)}>
                                                        Review Event
                                                    </Button>
                                                )}
                                            </Typography>
                                        </div>
                                        <div style={{ marginRight: '10px', marginBottom: '7px' }}>
                                            <Typography>
                                                <Button variant="contained" onClick={() => handleOpenReviewModal(item.event_id)}>
                                                    Reviews
                                                </Button>
                                            </Typography>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {requestedEvents.length > 0 && (
                    <div className='joinEvents'>
                        <div className='txtUpcomming'>Requested Events</div>
                        <div className='cards'>
                            {Array.isArray(requestedEvents) && requestedEvents.map((item, index)=> (
                                <div key={index} index={index} className='eventCards'>
                                    <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                                        <div style={{width:'100%', display: 'flex'}}>
                                            <div className='eventName'>{item.event_name}</div>
                                            <div className='count'><span class="icon">&#x21e7;</span>{item.upvote_count}</div>
                                        </div>
                                        <div className='organizer'><i>by {item.event_organizer}</i></div>
                                        <div className='description'><span>Description: </span> {item.event_description}</div>
                                        <div className='type'><span>Type: </span> {item.event_type}</div>
                                        <div className='limit'><span>People Limit: </span> {item.event_participants_limit}</div>
                                        <div className='location'><span>Location: </span> {item.event_location}</div>
                                        <div className='date'><span>Date: </span> {handleDate(item.event_date)}</div>
                                        <div className='time' ><span>Time: </span>{handleTime(item.event_time)}</div>
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', paddingTop: '7px', alignItems: 'center'}}>
                                        <div style={{marginRight: 'auto'}}><Typography>Requested</Typography></div>
                                        <div>
                                            <Button variant="contained" 
                                                className="btnAdmin"
                                                style={{
                                                    backgroundColor: item.has_upvoted === 1 ? 'red' : 'green',
                                                    color: 'white'
                                                }}
                                                onClick={() => handleUpVoteRequested(item.event_id, username, index)}>
                                                <Typography>{item.has_upvoted === 1 ? 'Upvoted' : 'UpVote'}</Typography>
                                            </Button>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
                                        <Typography style={{ marginRight: 'auto' }}>
                                            {eventReviews[item.event_id] ? (
                                                <Button variant='contained' disabled>
                                                    Reviewed
                                                </Button>
                                            ) : (
                                                <Button variant='contained' onClick={() => handleOpenModal(item.event_id)}>
                                                    Review Event
                                                </Button>
                                            )}
                                        </Typography>
                                        <Typography>
                                            <Button variant="contained" onClick={() => handleOpenReviewModal(item.event_id)}>
                                                Reviews
                                            </Button>
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {registeredEvents.length > 0 && (
                        <div className='joinEvents'>
                            <div className='txtUpcomming'>Registered Events</div>
                            <div className='cards'>
                                {Array.isArray(registeredEvents) && registeredEvents.map((item, index)=> (
                                    <div key={index} index={index} className='eventCards'>
                                        <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                                            <div style={{width:'100%', display: 'flex'}}>
                                                <div className='eventName'>{item.event_name}</div>
                                                <div className='count'><span class="icon">&#x21e7;</span>{item.upvote_count}</div>
                                            </div>
                                            <div className='organizer'><i>by {item.event_organizer}</i></div>
                                        <div className='description'><span>Description: </span> {item.event_description}</div>
                                        <div className='type'><span>Type: </span> {item.event_type}</div>
                                        <div className='limit'><span>People Limit: </span> {item.event_participants_limit}</div>
                                        <div className='location'><span>Location: </span> {item.event_location}</div>
                                        <div className='date'><span>Date: </span> {handleDate(item.event_date)}</div>
                                        <div className='time'><span>Time: </span>{handleTime(item.event_time)}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingTop: '7px' }}>
                                        <div style={{ marginRight: 'auto', marginBottom: '7px', paddingRight: '10px' }}>
                                                <Typography>Registered</Typography>
                                        </div>
                                        <div style={{ marginRight: '10px', marginBottom: '7px' }}>
                                            <Button 
                                                variant="contained" 
                                                className="btnAdmin"
                                                style={{
                                                    backgroundColor: item.has_upvoted === 1 ? 'red' : 'green',
                                                    color:'white'
                                                }}
                                                onClick={() => handleUpVoteRegistered(item.event_id, username, index)}
                                            >
                                                <Typography>{item.has_upvoted === 1 ? 'Upvoted' : 'Upvote'}</Typography>
                                            </Button>
                                        </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', paddingTop: '7px' }}>
                                        <div style={{ marginRight: '10px', marginBottom: '7px', marginRight: 'auto'}}>
                                            <Typography>
                                                {eventReviews[item.event_id] ? (
                                                    <Button variant='contained' disabled>
                                                        Reviewed
                                                    </Button>
                                                ) : (
                                                    <Button variant='contained' onClick={() => handleOpenModal(item.event_id)}>
                                                        Review Event
                                                    </Button>
                                                )}
                                            </Typography>
                                        </div>
                                        <div style={{ marginRight: '10px', marginBottom: '7px' }}>
                                            <Typography>
                                                <Button variant="contained" onClick={() => handleOpenReviewModal(item.event_id)}>
                                                    Reviews
                                                </Button>
                                            </Typography>
                                        </div>
                                    </div>
                                    </div>
                            ))}
                        </div>
                    </div>
                )}
            {pastevents.length > 0 && (
                <div className='joinEvents'>
                    <div className='txtUpcomming'>Past Events</div>
                    <div className='cards'>
                        {pastevents.map((item, index)=> (
                            <div key={index} className='eventCards'>
                                <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                                    <div style={{width:'100%', display: 'flex'}}>
                                        <div className='eventName'>{item.event_name}</div>
                                        <div className='count'><span className="icon">&#x21e7;</span>{item.event_vote_count}</div>
                                    </div>
                                    <div className='organizer'><i>by {item.event_organizer}</i></div>
                                    <div className='description'><span>Description: </span> {item.event_description}</div>
                                    <div className='type'><span>Type: </span> {item.event_type}</div>
                                    <div className='limit'><span>People Limit: </span> {item.event_participants_limit}</div>
                                    <div className='location'><span>Location: </span> {item.event_location}</div>
                                    <div className='date'><span>Date: </span> {handleDate(item.event_date)}</div>
                                    <div className='time'><span>Time: </span>{handleTime(item.event_time)}</div>
                                </div>
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row'}}>
                                    <Typography style={{ marginRight: 'auto' }}>
                                        {eventReviews[item.event_id] ? (
                                            <Button variant='contained' disabled>
                                                Reviewed
                                            </Button>
                                        ) : (
                                            <Button variant='contained' onClick={() => handleOpenModal(item.event_id)}>
                                                Review Event
                                            </Button>
                                        )}
                                    </Typography>
                                    <Typography>
                                        <Button variant="contained" onClick={() => handleOpenReviewModal(item.event_id)}>
                                            Reviews
                                        </Button>
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <DialogContent>
                    {isModalOpen && eventsDetails && (
                        <Review eventId={eventID} onClose={handleCloseModal} />
                    )}
                </DialogContent>
            </Modal>
            <Modal open={isModalReviewOpen} onClose={handleCloseModal}>
                <DialogContent>
                    {isModalReviewOpen && eventsDetails && (
                        <ViewReview eventId={eventID} onClose={handleCloseModal} />
                    )}
                </DialogContent>
            </Modal>
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
    </div>
);
}

export default OrganizerHome;