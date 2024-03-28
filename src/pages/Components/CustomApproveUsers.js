import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect} from 'react';


function ApproveUsersModal({ show, onHide, eventid, handleAccept, handleDecline }) {
    const [approveUsers, setApproveUsers] = useState([]);

    useEffect(() => {
        fetchusersreg(eventid);
    }, [eventid]);

    const fetchusersreg = (eventid) => {
        fetch('http://localhost:3000/approveusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventid })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setApproveUsers(data);
        })
        .catch(err => console.error(err));
    };

    const approveUser = (eventid, username) => {
        fetch('http://localhost:3000/updateAcceptedStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ eventid, username })
        })
        .then(res => res.json())
        .then(data => {
            // setNotifications(data);
            fetchusersreg(eventid);
            if (data.message) {
                toast.success(data.message);
            } else if (data.error) {
                toast.error(data.error);
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
            <Modal.Title>Pending Users</Modal.Title>
        </Modal.Header>
        <ToastContainer position="top-right" />
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {approveUsers.map((users, index) => (
            <Card key={index} style={{ marginBottom: '20px' }}>
                <Card.Body>
                    <Card.Title>{users.event_id}</Card.Title>
                    <Card.Text>{users.username}</Card.Text>
                    {/* No console.log here */}
                    
                        <div>
                            <Button variant="success" onClick={() => approveUser(users.event_id, users.username)}>Accept</Button>{' '}
                            <Button variant="danger" onClick={() => handleDecline(users)}>Decline</Button>
                        </div>
                    
                </Card.Body>
            </Card>
        ))}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
    </Modal.Footer> 
    </Modal>
    );
}

export default ApproveUsersModal;