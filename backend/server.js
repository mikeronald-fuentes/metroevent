const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT username, user_type FROM user_info WHERE username = ? AND password = ?';

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (result.length === 0) {
            console.log('Login failed');
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        } else {
            console.log('Login successful');
            res.json({ success: true, message: 'Login successful', user_type: result[0].user_type });
        }
    });
});

app.get('/admin', (req, res) => {
    const sql = "SELECT admin_list.username, admin_list.is_approved, user_info.first_name, user_info.last_name FROM admin_list JOIN user_info ON admin_list.username = user_info.username WHERE admin_list.is_approved = 0";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

app.post('/approve', (req, res) => {
    const { username } = req.body;

    const userSql = `
        UPDATE user_info
        SET user_type = 1
        WHERE username = ?`;

    const adminSql = `
        UPDATE admin_list
        SET is_approved = 1
        WHERE username = ?`;

    db.query(userSql, [username], (userErr, userResult) => {
        if (userErr) {
            console.error('Error updating user record: ', userErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        db.query(adminSql, [username], (adminErr, adminResult) => {
            if (adminErr) {
                console.error('Error updating admin record: ', adminErr);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log('Records updated successfully');
            res.json({ message: 'Records updated successfully' });
        });
    });
});

app.post('/decline', (req, res) => {
    const { username } = req.body;

    const adminSql = `
        DELETE FROM admin_list
        WHERE username = ?`;

    db.query(adminSql, [username], (adminErr, adminResult) => {
        if (adminErr) {
            console.error('Error updating admin record: ', adminErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('Records updated successfully');
        res.json({ message: 'Records updated successfully' });
    });
});


app.get('/users', (req, res) => {
    const sql = "SELECT * FROM user_info";
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