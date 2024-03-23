import React from "react";
import { Button, Typography } from "@mui/material";
import { useAuth } from '../Hooks/Authorization'; // Import useAuth hook for session management
import { useNavigate } from "react-router-dom";

export default function HeaderComponent() {
    const { logout } = useAuth(); // Get logout function from useAuth hook
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Call logout function to clear session
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.title}>Metro Events</h1>
                <Button color='inherit' onClick={handleLogout}> {/* Add onClick event handler for log out */}
                    <Typography>
                        Log out
                    </Typography>
                </Button>
            </header>
        </>
    );
}

const styles = {
    header: {
        backgroundColor: '#FFFFFF',
        color: '#000000',
        padding: '10px 0',
        textAlign: 'left',
        paddingTop: '10px',
        paddingLeft: '40px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        paddingRight: '20px',
    },
    title: {
        margin: 0,
    },
};