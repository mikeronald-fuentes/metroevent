import React from "react";
import { Button, Typography } from "@mui/material";

export default function HeaderComponent() {
    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.title}>Metro Events</h1>
                <Button color='inherit'>
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