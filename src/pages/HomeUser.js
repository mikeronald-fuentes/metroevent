import './homeUserStyles.css';
import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import UserProfile from './UserProfile';
import { useAuth } from '../Hooks/Authorization'; 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomeUser = () => {
    const [eventsDetails, setEventsDetails] = useState([]);
    const [upVote, setUpVote] = useState('');
    const [btnVote, setBtnVote] = useState([]);
    const [btnVoteRequested, setBtnVoteRequested] = useState([]);
    const [btnVoteRegistered, setBtnVoteRegistered] = useState([]);
    
    const [requestedEvents, setRequestedEvents] = useState([]);
    const [registeredEvents, setRegisteredEvents] = useState([]);
    const [pastevents, setPastEvents] = useState([]);
    const [btnRegister, setBtnRegister] = useState([]);
    const [username, setUsername] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        setUsername(UserProfile.getUsername());
        console.log(username);
        if (!username) {
            navigate('/login');
            return;
        }
        fetchingData();
        fetchingStyle();
    }, [username]);

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
                setEventsDetails(data)
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
                    setRequestedEvents(data)
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
    // para sa initial color of the register button
    const fetchingStyle = () => {
        fetch('http://localhost:3000/checkjoinupvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setUpVote(data);
            console.log(data);
            const initialState = data.map(item => {
                if (item.has_upvoted === 1) {
                    return ['red', 'Upvoted'];
                } else {
                    return ['green', 'Upvote'];
                }
            });
            setBtnVote(initialState);
        })
        .catch(err => console.error(err));

        fetch('http://localhost:3000/checkregisteredupvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setUpVote(data);
            console.log(data);
            const initialState = data.map(item => {
                if (item.has_upvoted === 1) {
                    return ['red', 'Upvoted'];
                } else {
                    return ['green', 'Upvote'];
                }
            });
            setBtnVoteRegistered(initialState);
        })
        .catch(err => console.error(err));

        fetch('http://localhost:3000/checkrequestedupvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setUpVote(data);
            console.log(data);
            const initialState = data.map(item => {
                if (item.has_upvoted === 1) {
                    return ['red', 'Upvoted'];
                } else {
                    return ['green', 'Upvote'];
                }
            });
            setBtnVoteRequested(initialState);
        })
        .catch(err => console.error(err));
    };

    // upgrade account
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
            console.log(data);
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
        
    };
    
    //
    const handleRegisterEvent = (username, eventid, index) => {
        console.log('nakasud');
        fetch(`http://localhost:3000/registerevent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, eventid })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            fetchingData();
            fetchingStyle();
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
    };
    
    const handleUpVote = (eventid, username, index) => {
        if (btnVote[index]?.[0] === 'red') {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                const { message, newCount } = data;
                console.log(message);
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
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
                const { message, newCount } = data;
                console.log(message); 
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };

    const handleUpVoteRegistered = (eventid, username, index) => {
        if (btnVoteRegistered[index]?.[0] === 'red') {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                const { message, newCount } = data;
                console.log(message);
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
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
                const { message, newCount } = data;
                console.log(message); 
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };

    const handleUpVoteRequested = (eventid, username, index) => {
        if (btnVoteRequested[index]?.[0] === 'red') {
            fetch(`http://localhost:3000/removeupvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ eventid, username })
            })
            .then(res => res.json())
            .then(data => {
                const { message, newCount } = data;
                console.log(message);
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
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
                const { message, newCount } = data;
                console.log(message); 
                console.log(newCount);
                fetchingData();
                fetchingStyle();
                if (data.message) {
                    toast.success(data.message);
                    // Fetch updated event details after upvote action
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
        }
    };
    
    useEffect(() => {
        // Fetch user's notifications when the component mounts
        fetchNotifications(username);
    }, []);

    const fetchNotifications = (username) => {
        // Fetch user's notifications from the backend
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
    

    const toggleNotificationVisibility = () => {
        // Toggle the visibility of the notification div
        setShowNotifications(prevState => !prevState);
        if (!showNotifications) {
            // Fetch notifications when the notification div is shown
            fetchNotifications();
        }
    };
    
    // format date
    const handleDate = (date) => {
        const timestamp = date;
        const dateObject = new Date(timestamp);

        const year = dateObject.getFullYear(); 
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate(); 

        const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;
        return formattedDate;
    };

    //format time
    const handleTime = (time) =>{
        const timestamp = time;
        const dateObject = new Date(timestamp);
        
        const hour = dateObject.getHours();
        const minute = dateObject.getMinutes();
        const period = hour >= 12 ? 'PM' : 'AM';

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

    return(
        <div className='userHomeScreen'>
            <div className='header'>
                <div className='title'>Metro Events</div>
                <div className="notification-container">
            <button onClick={toggleNotificationVisibility}>Notifications</button>
            {showNotifications && (
                <div className="notification-list">
                    {notifications.map(notification => (
                        <div key={notification.notification} className="notification-item">
                            {notification.text}
                        </div>
                    ))}
                </div>
            )}
        </div>
                <div className='logout'><Button color='inherit' onClick={handleLogout}> {/* Add onClick event handler for log out */}
                    <Typography>
                        Log out
                    </Typography>
                </Button></div>
            </div> 
            <ToastContainer position="top-right" />
            <div className='btnBeOrganizer'>
                <Button variant="contained" className="btnOrganizer" onClick={() => handleUpgradeAccount(username, 0)}>
                    <Typography>Be an organizer</Typography>
                </Button>
                <Button variant="contained" className="btnAdmin" onClick={() => handleUpgradeAccount(username, 1)}>
                    <Typography>Be an admin</Typography>
                </Button>
            </div>
            
            <div className='joinEvents'>
                <div className='txtUpcomming'>Join Event</div>
                <div className='cards'>
                {Array.isArray(eventsDetails) && eventsDetails.map((item, index)=> (
                    <div key={index} index={index} className='eventCards' >
                        <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                            <div style={{width:'100%', display: 'flex'}}>
                                <div className='eventName'>
                                    {item.event_name}
                                </div>
                                <div className='count'>
                                <span class="icon">&#x21e7;</span>{item.event_vote_count}
                                </div>
                            </div>
                        <div className='organizer'>
                            <i>by {item.event_organizer}</i>
                        </div>
                        <div className='description'>
                           <span>Description: </span> {item.event_description}
                        </div>
                        <div className='type'>
                            <span>Type: </span> {item.event_type}
                        </div>
                        <div className='limit'>
                           <span>People Limit: </span> {item.event_participants_limit}
                        </div>
                        <div className='location'>
                            <span>Location: </span> {item.event_location}
                        </div>
                        <div className='date'>
                            <span>Date: </span> {handleDate(item.event_date)}
                        </div>
                        <div className='time' >
                            <span>Time: </span>{handleTime(item.event_time)}
                        </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', paddingTop: '7px'}}>
                            <div style={{marginRight: 'auto'}}>
                            <Button 
                                variant="contained" 
                                className="btnAdmin" 
                                style={{ backgroundColor: btnRegister[index]?.[0] || 'blue' }} 
                                onClick={() => handleRegisterEvent(username, item.event_id, index)}
                                disabled={btnRegister[index]?.[2] || false} // Use the third element for disabled state
                            >
                                <Typography>{btnRegister[index]?.[1] || 'Register'}</Typography>
                            </Button>
                            </div>
                            <div>
                                <Button variant="contained" 
                                    className="btnAdmin"
                                    style={{backgroundColor: btnVote[index]?.[0] === 'red' ? 'red' : 'green',
                                        color: btnVote[index]?.[0] === 'white'}}
                                    onClick={() => handleUpVote(item.event_id, username, index)}
                                    >
                                    <Typography>{btnVote[index]?.[1]}</Typography>
                                </Button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className='joinEvents'>
                <div className='txtUpcomming'>Registered Events</div>
                <div className='cards'>
                {Array.isArray(registeredEvents) && registeredEvents.map((item, index)=> (
                    <div key={index} index={index} className='eventCards' >
                        <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                            <div style={{width:'100%', display: 'flex'}}>
                                <div className='eventName'>
                                    {item.event_name}
                                </div>
                                <div className='count'>
                                <span class="icon">&#x21e7;</span>{item.event_vote_count}
                                </div>
                            </div>
                        <div className='organizer'>
                            <i>by {item.event_organizer}</i>
                        </div>
                        <div className='description'>
                           <span>Description: </span> {item.event_description}
                        </div>
                        <div className='type'>
                            <span>Type: </span> {item.event_type}
                        </div>
                        <div className='limit'>
                           <span>People Limit: </span> {item.event_participants_limit}
                        </div>
                        <div className='location'>
                            <span>Location: </span> {item.event_location}
                        </div>
                        <div className='date'>
                            <span>Date: </span> {handleDate(item.event_date)}
                        </div>
                        <div className='time' >
                            <span>Time: </span>{handleTime(item.event_time)}
                        </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', paddingTop: '7px', alignItems: 'center'}}>
                            <div style={{marginRight: 'auto'}}>
                                <Typography>Registered</Typography>
                            </div>
                            <div>
                                <Button variant="contained" 
                                    className="btnAdmin"
                                    style={{backgroundColor: btnVoteRegistered[index]?.[0] === 'red' ? 'red' : 'green',
                                        color: btnVoteRegistered[index]?.[0] === 'white'}}
                                    onClick={() => handleUpVoteRegistered(item.event_id, username, index)}
                                    >
                                    <Typography>{btnVoteRegistered[index]?.[1]}</Typography>
                                </Button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className='joinEvents'>
                <div className='txtUpcomming'>Requested Events</div>
                <div className='cards'>
                {Array.isArray(requestedEvents) && requestedEvents.map((item, index)=> (
                    <div key={index} index={index} className='eventCards' >
                        <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                            <div style={{width:'100%', display: 'flex'}}>
                                <div className='eventName'>
                                    {item.event_name}
                                </div>
                                <div className='count'>
                                <span class="icon">&#x21e7;</span>{item.event_vote_count}
                                </div>
                            </div>
                        <div className='organizer'>
                            <i>by {item.event_organizer}</i>
                        </div>
                        <div className='description'>
                           <span>Description: </span> {item.event_description}
                        </div>
                        <div className='type'>
                            <span>Type: </span> {item.event_type}
                        </div>
                        <div className='limit'>
                           <span>People Limit: </span> {item.event_participants_limit}
                        </div>
                        <div className='location'>
                            <span>Location: </span> {item.event_location}
                        </div>
                        <div className='date'>
                            <span>Date: </span> {handleDate(item.event_date)}
                        </div>
                        <div className='time' >
                            <span>Time: </span>{handleTime(item.event_time)}
                        </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', paddingTop: '7px', alignItems: 'center'}}>
                            <div style={{marginRight: 'auto'}}>
                                <Typography>Requested</Typography>
                            </div>
                            <div>
                                <Button variant="contained" 
                                    className="btnAdmin"
                                    style={{backgroundColor: btnVoteRequested[index]?.[0] === 'red' ? 'red' : 'green',
                                        color: btnVote[index]?.[0] === 'white'}}
                                    onClick={() => handleUpVoteRequested(item.event_id, username, index)}
                                    >
                                    <Typography>{btnVoteRequested[index]?.[1]}</Typography>
                                </Button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className='joinEvents'>
                <div className='txtUpcomming'>Past Events</div>
                <div className='cards'>
                {pastevents.map((item, index)=> (
                    <div key={index} index={index} className='eventCards' >
                        <div style={{marginBottom: 'auto', overflowY: 'auto'}}>
                            <div style={{width:'100%', display: 'flex'}}>
                                <div className='eventName'>
                                    {item.event_name}
                                </div>
                                <div className='count'>
                                <span class="icon">&#x21e7;</span>{item.event_vote_count}
                                </div>
                            </div>
                        <div className='organizer'>
                            <i>by {item.event_organizer}</i>
                        </div>
                        <div className='description'>
                           <span>Description: </span> {item.event_description}
                        </div>
                        <div className='type'>
                            <span>Type: </span> {item.event_type}
                        </div>
                        <div className='limit'>
                           <span>People Limit: </span> {item.event_participants_limit}
                        </div>
                        <div className='location'>
                            <span>Location: </span> {item.event_location}
                        </div>
                        <div className='date'>
                            <span>Date: </span> {handleDate(item.event_date)}
                        </div>
                        <div className='time' >
                            <span>Time: </span>{handleTime(item.event_time)}
                        </div>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeUser;