const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'metro_event'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to database');
});

app.get('/', (req, res) => {
    res.json('from backend');
});

app.get('/admin', (req, res) => {
    const sql = "SELECT admin.username, admin.is_approved, users.first_name, users.last_name FROM admin JOIN users ON admin.username = users.username WHERE admin.is_approved = 0";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

app.put('/approve/:username', (req, res) => {
    const { username } = req.params;
    const sql = `
        UPDATE users, admin 
        SET users.user_type = 1, admin.is_approved = 1
        WHERE username = ?`;

    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error('Error updating record: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Record updated successfully');
        res.json({ message: 'Record updated successfully' });
    });
});

app.get('/event_type', (req, res) => {
    const sql = "SELECT * FROM event_type";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

app.get('/user_type', (req, res) => {
    const sql = 'SELECT * FROM user_type';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});