import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";
import { useAuth } from '../Hooks/Authorization';
import { useNavigate } from "react-router-dom";

function Admin() {
    const { user } = useAuth();

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

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

    const getRequestTypeLabel = (requestType) => {
        return requestType === 0 ? "Organizer Request" : "Administrator Request";
    };

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
            setRequests(prevRequests => prevRequests.filter(item => item.username !== username));
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
            setRequests(prevRequests => prevRequests.filter(item => item.username !== username));
        })
        .catch(err => console.error(err));
    };       

    return (
        <>
            <HeaderComponent />
            <div style={{ marginTop: '5%', display: 'flex', flexDirection: 'column', alignItems: 'start', width: '100%' }}>
                <div style={{ margin: 'auto', width: '80%' }}>
                    <h1>Requests</h1>
                    <div style={{ boxShadow: '3px 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f2f2f2', padding: '30px', borderRadius: '10px', margin: 'auto' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'center', padding: '15px', width: '30%' }}>Name</th>
                                        <th style={{ textAlign: 'center', padding: '15px', width: '40%' }}>Description</th>
                                        <th style={{ textAlign: 'center', padding: '15px', width: '30%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: 'center' }}>
                                    {requests.map((item, index) => (
                                        <tr key={item.id || index} style={{ fontSize: '1.2em', marginBottom: '20px', marginRight: '20px' }}>
                                            <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{item.first_name} {item.last_name}</td>
                                            <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{item.request_type === 0 ? 'Organizer Request' : 'Administrator Request'}</td>
                                            <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>
                                                <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', marginRight: '10px' }} onClick={() => handleApprove(item.username, item.requestType)}>Approve</button>
                                                <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px' }} onClick={() => handleDecline(item.username, item.requestType)}>Decline</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Admin;