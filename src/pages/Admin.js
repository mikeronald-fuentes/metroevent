import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { useAuth } from '../Hooks/Authorization'; // Import useAuth hook for session management
import { useNavigate } from "react-router-dom";

function Admin() {
    const { user } = useAuth(); // Get user from useAuth hook

    const [organizerRequests, setOrganizerRequests] = useState([]);
    const [administratorRequests, setAdministratorRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        if (!user) {
            navigate('/login'); // Redirect to login if user is not authenticated
            return;
        }

        fetch('http://localhost:3000/admin')
            .then(res => res.json())
            .then(data => {
                const organizerRequest = data.filter(item => item.request_type === 0);
                const adminRequest = data.filter(item => item.request_type === 1);
                setOrganizerRequests(organizerRequest);
                setAdministratorRequests(adminRequest);
            })
            .catch(err => console.error(err));
    }, [user, navigate]); // Include navigate in the dependency array

    const handleApprove = (username, requestType) => {
        console.log(`Approve button clicked for username: ${username}`);
        fetch(`http://localhost:3000/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, requestType })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            // Use functional form of setState to update state based on previous state
            setOrganizerRequests(prevOrganizerRequests => prevOrganizerRequests.filter(item => item.username !== username));
            setAdministratorRequests(prevAdministratorRequests => prevAdministratorRequests.filter(item => item.username !== username));
        })
        .catch(err => console.error(err));
    };    
    
    const handleDecline = (username, requestType) => {
        console.log(`Decline button clicked for username: ${username}`);
        fetch(`http://localhost:3000/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, requestType })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            // Use functional form of setState to update state based on previous state
            setOrganizerRequests(prevOrganizerRequests => prevOrganizerRequests.filter(item => item.username !== username));
            setAdministratorRequests(prevAdministratorRequests => prevAdministratorRequests.filter(item => item.username !== username));
        })
        .catch(err => console.error(err));
    };       

    return (
        <>
            <HeaderComponent />
            <div style={{ marginLeft: '20px' }}>
                <h2>Organizer Requests</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {organizerRequests.map((item, index) => (
                        <div key={item.id || index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', minWidth: '200px', backgroundColor: '#e6f7ff' }}>
                            <h3>{item.first_name} {item.last_name}</h3>
                            <p>{item.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }} onClick={() => handleApprove(item.username, item.requestType)}>Approve</button>
                                <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }} onClick={() => handleDecline(item.username, item.requestType)}>Decline</button>
                            </div>
                        </div>
                    ))}
                </div>
                <h2>Administrator Requests</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {administratorRequests.map((item, index) => (
                        <div key={item.id || index} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', minWidth: '200px', backgroundColor: '#ffe6e6' }}>
                            <h3>{item.first_name} {item.last_name}</h3>
                            <p>{item.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }} onClick={() => handleApprove(item.username, item.requestType)}>Approve</button>
                                <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }} onClick={() => handleDecline(item.username, item.requestType)}>Decline</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Admin;