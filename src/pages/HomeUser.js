import './homeUserStyles.css';
import { useState, useEffect } from "react";
import { Typography, Button, Modal, DialogContent } from "@mui/material";
import UserProfile from './UserProfile';
import { useAuth, username } from '../Hooks/Authorization'; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Review from './Components/CustomReviewModal';
import ViewReview from './Components/CustomViewReviewModal';

const HomeUser = () => {
    const [eventsDetails, setEventsDetails] = useState([]);
    const [requestedEvents, setRequestedEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pastevents, setPastEvents] = useState([]);
    const [username, setUsername] = useState(UserProfile.getUsername() || '');
    const [eventID, setEventID] = useState(null);
    const [eventReviews, setEventReviews] = useState({});
    const [notifications, setNotifications] = useState([]);
    const { logout } = useAuth(); 
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReviewOpen, setIsModalReviewOpen] = useState(false);

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

    // re render event data when register or vote button is clicked
    const fetchingData = () => {
        fetch('http://localhost:3000/joinevents',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setEventsDetails(data);
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
    }

    // upgrade account to be organizer or admin
    const handleUpgradeAccount = (username, type) => {
        fetch(`http://localhost:3000/upgradeaccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, type })
        })
        .then(res => res.json())
        .then(data => {
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
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
    const handleTime = (time) =>{
        const timestamp = time;
        const dateObject = new Date(timestamp);
        
        let hour = dateObject.getHours();
        let minute = dateObject.getMinutes();
        let period = hour >= 12 ? 'PM' : 'AM';

        if (hour > 12) {
            hour -= 12;
        } else if (hour === 0) { 
            hour = 12;
        }

        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
        return formattedTime;
    }

    // logout
    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    // Open Modal
    const handleOpenModal = (eventId) => {
        setEventID(eventId);
        setIsModalOpen(true);
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
        <div className='userHomeScreen'>
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
            <div className='btnBeOrganizer'>
                <div style={{width: 'auto', marginRight: 'auto', color: 'black', paddingLeft: '50px'}}>
                    <h3>Welcome, <span style={{color: '#4c908a', fontWeight: '700'}}>{username} &#128513;</span></h3>
                </div>
                <Button variant="contained" className="btnOrganizer" onClick={() => handleUpgradeAccount(username, 0)}>
                    <Typography>Be an organizer</Typography>
                </Button>
                <Button variant="contained" className="btnAdmin" onClick={() => handleUpgradeAccount(username, 1)}>
                    <Typography>Be an admin</Typography>
                </Button>
            </div>
            <div className='containerEvents'>
                {eventsDetails.length > 0 && (
                    <div className='joinEvents'>
                        <div className='txtUpcomming'>Join Event</div>
                        <div className='cards'>
                            {Array.isArray(eventsDetails) && eventsDetails.map((item, index)=> (
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
                                            <Button 
                                                variant="contained" 
                                                className="btnAdmin" 
                                                style={{ backgroundColor: 'blue' }} 
                                                onClick={() => handleRegisterEvent(username, item.event_id)}
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
                                                onClick={() => handleUpVoteRegistered(item.event_id, username, index)}
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
        <div style={{width: '21%'}}>
            <div className='notificationContainer'>
                <div style={{marginTop: '10px', paddingLeft: '20px'}}><h2>Notifications</h2></div>
                <div style={{overflowX: 'auto'}}>
                {Array.isArray(notifications) && notifications.map((item, index)=> (
                    <div key={index} className='notificationCard'>
                        <div><h6>{item.notification}</h6></div>
                        <div>Message: {item.text}</div>
                    </div>
                )) }
                </div>
                {notifications.length <= 0 &&
                    <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center', padding: 'auto'}}>
                        <h6>No Notifications</h6>
                    </div>
                }
            </div>
        </div>
    </div>
);
}

export default HomeUser;