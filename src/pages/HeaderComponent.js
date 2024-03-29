import React from "react";
import { Button, Typography } from "@mui/material";
import { useAuth } from '../Hooks/Authorization';
import { useNavigate } from "react-router-dom";

export default function HeaderComponent() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.title}>Metro Events</h1>
                <Button color='inherit' onClick={handleLogout}> 
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
        flex: '1',
    },
    title: {
        margin: 0,
    },
};