import React, { useState } from "react";
import UserProfile from "../UserProfile";
import { TextField, Typography, Card, Button } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Review({ eventId, onClose }) {
    const username = UserProfile.getUsername();
    const [review, setReview] = useState('');

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleSubmitReview = () => {
        if (review.trim() === '') {
            toast.error('Please enter a review before submitting.');
            return;
        }

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
                width: '50%',
                backgroundColor: '#e3f4fa',
                color: 'black',
                textAlign: 'start',
                padding: '20px',
            }}>
                <h4>{username}</h4>
                <Typography>
                    Add Review:
                </Typography>
                <TextField
                    variant="filled"
                    placeholder="Review"
                    className="review"
                    value={review}
                    required={true}
                    onChange={handleReviewChange}
                    style={{ 
                        width: '100%',
                        marginBottom: '20px',
                    }}
                    multiline
                />
                <div style={{display: 'flex', margin: 'auto'}}>
                    <Typography style={{marginRight: 'auto'}}>
                        <Button 
                            onClick={handleSubmitReview} 
                            variant="contained"
                            style={{ 
                                cursor: review.trim() === '' ? 'not-allowed' : 'pointer',
                            }}
                            disabled={review.trim() === ''}
                        >
                            Submit Review
                        </Button>
                    </Typography>
                    <Typography>
                        <Button variant="contained" onClick={onClose}>
                            Close
                        </Button>
                    </Typography>
                </div>
            </Card>
        </div>
    );
}

export default Review;