import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomNotifModal({ show, onHide, notifications, handleAccept, handleDecline }) {
    console.log(notifications); // Log the entire notifications array to inspect its structure
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Notifications</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {notifications.map((notification, index) => (
                    <Card key={index} style={{ marginBottom: '20px' }}>
                        <Card.Body>
                            <Card.Title><strong>Notification:</strong> {notification.notification}</Card.Title>
                            <Card.Text>{notification.text}</Card.Text>
                            {/* No console.log here */}
                            {notification.notification_id === 5 && (
                                <div>
                                    <Button variant="success" onClick={() => handleAccept(notification)}>Accept</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDecline(notification)}>Decline</Button>
                                </div>
                            )}
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

export default CustomNotifModal;
