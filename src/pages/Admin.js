import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";

function Admin() {
    const [adminData, setAdminData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/admin')
            .then(res => res.json())
            .then(data => setAdminData(data))
            .catch(err => console.error(err));
    }, []);

    const handleApprove = (username) => {
        console.log(`Approve button clicked for username: ${username}`);
        fetch(`http://localhost:3000/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const updatedAdminData = adminData.filter(item => item.username !== username);
            setAdminData(updatedAdminData);
        })
        .catch(err => console.error(err));
    };    

    const handleDecline = (username) => {
        console.log(`Decline button clicked for username: ${username}`);
        fetch(`http://localhost:3000/decline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const updatedAdminData = adminData.filter(item => item.username !== username);
            setAdminData(updatedAdminData);
        })
        .catch(err => console.error(err));
    };

    return (
        <>
            <HeaderComponent />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {adminData.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', minWidth: '200px' }}>
                        <h3>{item.username}</h3>
                        <p>{item.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={() => handleApprove(item.username)}>Approve</button>
                            <button onClick={() => handleDecline(item.username)}>Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Admin;