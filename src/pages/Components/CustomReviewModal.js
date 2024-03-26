import React from "react";
import UserProfile from './UserProfile';
import { TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function Review( eventId ) {
    const username = UserProfile.getUsername();
    const [review, setReview] = useState('');

    const handleReviewChange = async (event) => {
        try{
            const response = await axios.post('http://localhost:3000/addreview', { username, eventId, review });
            if(response.reviewData){
                
            }
        } catch(error){
            console.log('Error adding review: ', error);
        }
    };

    return(
        <>
            <div className="reviewContainer">
                <card>
                    <p>Username: {username} </p>
                    <Typography>
                        Review:
                    </Typography>
                    <TextField
                        variant="outlined"
                        placeholder="Review"
                        className="review"
                        value={username}
                        onChange={handleReviewChange}
                    />
                </card>
            </div>
        </>
    );
}

export default Review;