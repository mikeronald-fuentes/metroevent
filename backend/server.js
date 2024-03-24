const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true
};

app.use(cors(corsOptions));
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
    const sql = 'SELECT username, user_type FROM user_info WHERE username = ' + db.escape(username) + ' AND password = ' + db.escape(password);

    db.query(sql, (err, result) => {
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
    const sql = "SELECT admin_list.request_type, admin_list.username, admin_list.is_approved, user_info.first_name, user_info.last_name FROM admin_list JOIN user_info ON admin_list.username = user_info.username WHERE admin_list.is_approved = 0";

    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Fetched data:', data);
        res.json(data);
    });
});

app.post('/approve', (req, res) => {
    const { username } = req.body;
    let message;
    let category;
    
    const requestTypeSql = `
        SELECT request_type 
        FROM admin_list 
        WHERE username = ?`;

    const userSql = `
        UPDATE user_info 
        SET user_type = 
            CASE WHEN ? = 0 
                THEN 1 WHEN ? = 1 
                THEN 2 ELSE user_type 
            END 
        WHERE username = ?`;

    const adminSql = `
        UPDATE admin_list 
        SET is_approved = 1 
        WHERE username = ?`;

    const notifSql = `
        INSERT INTO user_notification 
        (username, notification_category, notification_info) 
        VALUES (?, ?, ?)`;

    db.query(requestTypeSql, [username], (requestTypeErr, requestTypeResult) => {
        if (requestTypeErr) {
            console.error('Error fetching request type: ', requestTypeErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (requestTypeResult.length === 0) {
            console.error('Request type not found for user: ', username);
            res.status(404).json({ error: 'Request type not found' });
            return;
        }

        const requestType = requestTypeResult[0].request_type;

        if (requestType === 0) {
            message = "Request to become an organizer is accepted";
            category = 3;
        } else if (requestType === 1) {
            message = "Request to become an administrator is accepted";
            category = 1;
        } else {
            console.error('Invalid request type for user: ', username);
            res.status(400).json({ error: 'Invalid request type' });
            return;
        }

        db.query(userSql, [requestType, requestType, username], (userErr, userResult) => {
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

                db.query(notifSql, [username, category, message], (notifErr, notifResult) => {
                    if (notifErr) {
                        console.error('Error inserting notification: ', notifErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }

                    console.log('Records updated successfully');
                    res.json({ message: 'Records updated successfully' });
                });
            });
        });
    });
});

app.post('/decline', (req, res) => {
    const { username } = req.body;
    let message;
    let category;

    const adminSql = `
        DELETE FROM admin_list 
        WHERE username = ?`;
    
    const notifSql = `
        INSERT INTO user_notification 
        (username, notification_category, notification_info) 
        VALUES (?, ?, ?)`;

    const requestTypeSql = `
        SELECT request_type 
        FROM admin_list 
        WHERE username = ?`;

    if (username) {
        db.query(requestTypeSql, [username], (requestTypeErr, requestTypeResult) => {
            if (requestTypeErr) {
                console.error('Error fetching request type: ', requestTypeErr);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (requestTypeResult.length === 0) {
                console.error('Invalid username provided');
                res.status(400).json({ error: 'Invalid username' });
                return;
            }

            const requestType = requestTypeResult[0].request_type;

            if (requestType === 0) {
                message = "Request to become an organizer is declined";
                category = 2;
            } else if (requestType === 1) {
                message = "Request to become an administrator is declined";
                category = 0;
            } else {
                console.error('Invalid request type for user: ', username);
                res.status(400).json({ error: 'Invalid request type' });
                return;
            }

            db.query(adminSql, [username], (adminErr, adminResult) => {
                if (adminErr) {
                    console.error('Error deleting admin record: ', adminErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                db.query(notifSql, [username, category, message], (notifErr, notifResult) => {
                    if (notifErr) {
                        console.error('Error inserting notification: ', notifErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }

                    console.log('Admin record deleted successfully for username:', username);
                    res.json({ message: 'Admin record deleted successfully' });
                });
            });
        });
    } else {
        console.error('Invalid username provided');
        res.status(400).json({ error: 'Invalid username' });
        return;
    }
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
