import React, { useEffect, useState } from "react";
import HeaderComponent from "./HeaderComponent";

export default function Admin() {
    const [adminData, setAdminData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/admin')
            .then(res => res.json())
            .then(data => setAdminData(data))
            .catch(err => console.error(err));
    }, []);

    const handleApprove = (id) => {
        console.log(`Approve button clicked for id: ${id}`);
    };

    const handleDecline = (id) => {
        console.log(`Decline button clicked for id: ${id}`);
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
                            <button onClick={() => handleApprove(item.id)}>Approve</button>
                            <button onClick={() => handleDecline(item.id)}>Decline</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
