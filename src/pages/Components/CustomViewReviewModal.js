import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import axios from "axios";

function ViewReview({ eventId, onClose }) {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (eventId) {
            axios.get(`http://localhost:3000/viewreviews?eventId=${eventId}`)
                .then(response => {
                    setReviews(response.data);
                    console.log(reviews);
                    console.log(eventId);
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                });
        }
    }, [eventId]);

    if (!eventId) {
        return null; // Return null if eventId is not defined
    }

    
    return (
        <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                outline: 'none',
                width: '80%',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <Typography variant="h5" gutterBottom>Reviews</Typography>
                {reviews.map((review, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                            <Typography variant="body2"><h4>{review.event_review}</h4></Typography>
                            <Typography variant="body1"> 
                                <h6><i>review by {review.username}</i></h6>
                            </Typography>
                            <br></br>
                        </CardContent>
                    </Card>
                ))}
                <Button variant="contained" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}

export default ViewReview;