import React, { useState } from "react";
import UserProfile from "../UserProfile";
import { TextField, Typography, Card } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Review({ eventId, onClose }) { // Add onClose as a prop
    const username = UserProfile.getUsername();
    const [review, setReview] = useState('');
    
    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmitReview = () => {
        axios.post(`http://localhost:3000/addreview`, {
            username: username,
            eventId: eventId,
            review: review
        })
        .then(res => {
            toast.success('Review Posted');
            onClose();
        })
        .catch(err => {
            toast.error('Error submitting review:', err);
        });
    };

    return(
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
        }}>
            <Card style={{
                width: '20%',
                backgroundColor: '#e3f4fa',
                color: 'black',
                textAlign: 'start',
                padding: '20px',
            }}>
                <h4>{username} </h4>
                <br></br>
                <Typography>
                    Add Review:
                </Typography>
                <TextField
                    variant="filled"
                    placeholder="Review"
                    className="review"
                    value={review}
                    onChange={handleReviewChange}
                />
                <button onClick={handleSubmitReview} style={{ marginTop: '10px', color: 'black', backgroundColor: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Submit Review</button>
            </Card>
        </div>
    );
}

export default Review;