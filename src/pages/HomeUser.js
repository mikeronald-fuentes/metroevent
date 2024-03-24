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
    const [checkBtnRegister, setCheckBtnRegister] = useState([]);
    const [btnRegister, setBtnRegister] = useState([]);
    const [username, setUsername] = useState([]);
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/userhome')
            .then(res => res.json())
            .then(data => setEventsDetails(data))
            .catch(err => console.error(err));
            setUsername(UserProfile.getUsername());
    }, []);
    
    // para sa initial color of the register button
    useEffect(() => {
        fetch('http://localhost:3000/checkupvote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            setUpVote(data);
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
    }, [eventsDetails, username]);

    // para sa initial color of the register button
    useEffect(() => {
        fetch('http://localhost:3000/checkregistered', {
            method: 'GET',
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
                if (item.is_registered === 0) {
                    return ['blue', 'Register', false];
                } else if (item.is_registered === 1 && item.is_accepted === 0) {
                    return ['grey', 'Requested', true];
                } else if (item.is_registered === 1 && item.is_accepted === 1) {
                    return ['grey', 'Registered', true];
                }
            });
            setBtnRegister(initialState);
        })
        .catch(err => console.error(err));
    }, [eventsDetails, username]);

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
        setBtnRegister(prevBtnRegister => {
            const btnReg = [...prevBtnRegister];
            btnReg[index] = ['grey', 'Requested'];
            return btnReg;
        });
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
            if(data.message){
                toast.success(data.message);
            }else if(data.error){
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
    };

    const handleUpVote = (eventid, username, index) => {
        // para when up vote button was clicked
        if (btnVote[index]?.[0] === 'red') {
            //reduce 1 upvote count
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
                console.log(message); // Log the message
                console.log(newCount);
                setBtnVote(prevBtnVote => {
                    const updatedBtnVote = [...prevBtnVote];
                    updatedBtnVote[index] = ['green', 'Up Vote']; 
                    return updatedBtnVote;
                });
                
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
                const { message, newCount } = data;
                console.log(message); 
                console.log(newCount);

                setBtnVote(prevBtnVote => {
                    const updatedBtnVote = [...prevBtnVote];
                    updatedBtnVote[index] = ['red', 'Upvoted']; 
                    return updatedBtnVote;
                });
                
                if (data.message) {
                    toast.success(data.message);
                } else if (data.error) {
                    toast.error(data.error);
                }
            })
            .catch(err => console.error(err));
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
                {eventsDetails.map((item, index)=> (
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
                                        color: btnVote[index]?.[0] === 'red' ? 'white' : 'black'}}
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
        </div>
    );
};

export default HomeUser;