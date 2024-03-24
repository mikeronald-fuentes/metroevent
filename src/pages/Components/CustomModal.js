import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function CustomModal({ show, onHide, eventData }) {

    const handleCancel = async () => {
        try {
            const response = await fetch(`http://localhost:3000/events/cancel/${eventData.event_id}`, {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to cancel event');
            }
            const data = await response.json();
            if (data.success) {
                alert('Event canceled successfully');
                onHide(); // Close the modal
            } else {
                throw new Error('Failed to cancel event');
            }
        } catch (error) {
            console.error('Error canceling event:', error);
            // Handle error
        }
    };
    // Function to format date as Month-Month-Day-Year
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    // Function to format time as Hour:minutes AM/PM
    const formatTime = (timeString) => {
        const time = new Date(`2000-01-01T${timeString}`);
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Event Details</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ wordWrap: 'break-word' }}>
                {eventData && (
                    <div>
                        <p><strong>Event ID:</strong> {eventData.event_id}</p>
                        <p><strong>Organizer:</strong> {eventData.event_organizer}</p>
                        <p><strong>Type:</strong> {eventData.event_type}</p>
                        <p><strong>Name:</strong> {eventData.event_name}</p>
                        <p><strong>Description:</strong> {eventData.event_description}</p>
                        <p><strong>Participants Limit:</strong> {eventData.event_participants_limit}</p>
                        <p><strong>Location:</strong> {eventData.event_location}</p>
                        <p><strong>Date:</strong> {formatDate(eventData.event_date)}</p>
                        <p><strong>Time:</strong> {formatTime(eventData.event_time)}</p>
                        {/* Render other event details */}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleCancel}>Cancel Event</Button>
                {/* Add other footer buttons if needed */}
            </Modal.Footer>
        </Modal>
    );
}

export default CustomModal;
