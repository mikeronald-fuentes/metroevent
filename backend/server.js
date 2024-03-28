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

app.post('/addevent', (req, res) => {
    const {
        organizer,
        eventType,
        eventName,
        description,
        limit,
        location,
        date,
        time,
    } = req.body;

    // Check if the organizer exists and is an organizer (user_type = 1)
    const checkOrganizerSql = 'SELECT * FROM user_info WHERE username = ? AND user_type = 1';
    db.query(checkOrganizerSql, [organizer], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Error checking organizer:', checkErr);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (checkResult.length === 0) {
            // Organizer doesn't exist or is not an organizer
            console.error('Organizer does not exist or is not an organizer');
            res.status(400).json({ error: 'Organizer does not exist or is not an organizer' });
            return;
        }

        // Organizer exists and is an organizer, proceed with event insertion
        const insertEventSql = `
            INSERT INTO event_info 
            (event_organizer, event_type, event_name, event_description, event_participants_limit, event_location,  event_date,  event_time) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertEventSql, [organizer, eventType, eventName, description, limit, location, date, time], (err, result) => {
            if (err) {
                console.error('Error adding event:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
        });
    });
});



app.get('/events/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'SELECT * FROM event_info WHERE event_organizer = ?';

    db.query(sql, [username], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (data.length === 0) {
            // If no events found for the organizer, return a 404 error
            res.status(404).json({ error: 'No events found for the organizer' });
            return;
        }

        // Respond with the fetched events data
        res.json(data);
    });
});

//all events not including yours
app.get('/events', (req, res) => {
    const { username } = req.query; // Assuming the username is passed as a query parameter
    const sql = `
        SELECT event_info.*
        FROM event_info
        WHERE event_info.event_id NOT IN (
            SELECT event_id
            FROM event_attendees
            WHERE username = ?
        )`;

    db.query(sql, [username], (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});


app.get('/events/attended/:username', (req, res) => {
    const { username } = req.params;
    const sql = `
        SELECT event_info.*
        FROM event_info
        INNER JOIN event_attendees ON event_info.event_id = event_attendees.event_id
        WHERE event_attendees.username = ?`;

    db.query(sql, [username], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (data.length === 0) {
            // If no events found for the user, return a 404 error
            res.status(404).json({ error: 'No events found for the user' });
            return;
        }

        // Respond with the fetched events data
        res.json(data);
    });
});

app.post('/addreview', (req, res) => {
    const { username, eventId, review } = req.body;

    const sql = `
        INSERT INTO event_user_review
        (event_id, username, event_review)
        VALUES (?, ?, ?)`;

    db.query(sql, [eventId, username, review], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
            return;
        }

        if (result.affectedRows === 1) {
            console.log('Review added successfully');
            res.json({ success: true, message: 'Review added successfully' });
        } else {
            console.log('Failed to add review');
            res.status(500).json({ success: false, error: 'Failed to add review' });
        }
    });
});

app.get('/reviewedevents', async (req, res) => {
    try {
        const { username } = req.query;

        const sql = `
            SELECT * FROM event_user_review 
            WHERE username = ?
        `;
        
        db.query(sql, [username], (err, result) => {
            if (err) {
                console.error('Error fetching reviewed events:', err);
                res.status(500).json({ error: 'An unexpected error occurred' });
                return;
            }

            res.json(result);
        });
    } catch (error) {
        console.error('Error fetching reviewed events:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});


app.get('/viewreviews', (req, res) => {
    const { eventId } = req.query;
    
    const sql = `
        SELECT username, event_review
        FROM event_user_review 
        WHERE event_id = ?
    `;

    db.query(sql, [eventId], (err, result) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).json({ error: 'An unexpected error occurred' });
        } else {
            res.json(result);
        }
    });
});

app.post('/users', (req, res) => {
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

//fetch user joinable events
app.post('/joinevents', (req, res) => {
    const { username } = req.body;

    const sql = `
    SELECT 
        ei.*,
        IFNULL(MAX(CASE WHEN eu.username = ? THEN 1 ELSE 0 END), 0) AS has_upvoted,
        COUNT(eu.username) AS upvote_count
    FROM 
        event_info ei 
    LEFT JOIN 
        event_upvote eu ON ei.event_id = eu.event_id
    LEFT JOIN
        event_user_request eur ON ei.event_id = eur.event_id AND eur.username = ?
    WHERE 
        (eur.username IS NULL)
        AND ei.event_date >= CURDATE()  -- Ensures event date is not in the past
        AND (ei.event_date > CURDATE() OR (ei.event_date = CURDATE() AND ei.event_time > CURTIME())) -- Ensures event time is not in the past
    GROUP BY 
        ei.event_id
    ORDER BY 
        upvote_count DESC, has_upvoted DESC;
    `;

    db.query(sql, [username, username], (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });

});

// fetch user requested events
app.post('/requestedevents', (req, res) => {
     const { username } = req.body;

     const sql = `
         SELECT 
             ei.*,
             IFNULL(MAX(CASE WHEN eu.username = ? THEN 1 ELSE 0 END), 0) AS has_upvoted,
             COUNT(eu.username) AS upvote_count,
             COUNT(eur.event_id) AS event_vote_count
         FROM 
             event_info ei 
         LEFT JOIN 
             event_upvote eu ON ei.event_id = eu.event_id
         LEFT JOIN 
             event_user_request eur ON ei.event_id = eur.event_id AND eur.username = ? AND eur.is_accepted = 0
         WHERE 
             (eur.username IS NOT NULL)
             AND ei.event_date >= CURDATE()  -- Ensures event date is not in the past
             AND (ei.event_date > CURDATE() OR (ei.event_date = CURDATE() AND ei.event_time > CURTIME())) -- Ensures event time is not in the past
         GROUP BY 
             ei.event_id
         ORDER BY 
            upvote_count DESC, event_vote_count DESC;

     `;
 
     db.query(sql, [username, username], (err, data) => {
         if (err) {
             console.error('Error executing query: ', err);
             res.status(500).json({ error: 'Internal Server Error' });
             return;
         }
         res.json(data);
     });
    
});


// fetch user registered events
app.post('/registeredevents', (req, res) => {
    const { username } = req.body;

     const sql = `
         SELECT 
             ei.*,
             IFNULL(MAX(CASE WHEN eu.username = ? THEN 1 ELSE 0 END), 0) AS has_upvoted,
             COUNT(eu.username) AS upvote_count,
             COUNT(eur.event_id) AS event_vote_count
         FROM 
             event_info ei 
         LEFT JOIN 
             event_upvote eu ON ei.event_id = eu.event_id
         LEFT JOIN 
             event_user_request eur ON ei.event_id = eur.event_id AND eur.username = ? AND eur.is_accepted = 1
         WHERE 
             (eur.username IS NOT NULL)
             AND ei.event_date >= CURDATE()  -- Ensures event date is not in the past
             AND (ei.event_date > CURDATE() OR (ei.event_date = CURDATE() AND ei.event_time > CURTIME())) -- Ensures event time is not in the past
         GROUP BY 
             ei.event_id
         ORDER BY 
            upvote_count DESC, event_vote_count DESC;
        `;
 
     db.query(sql, [username, username], (err, data) => {
         if (err) {
             console.error('Error executing query: ', err);
             res.status(500).json({ error: 'Internal Server Error' });
             return;
         }
         res.json(data);
     });
});

// fetch past events
app.get('/pastevents', (req, res) => {
    let sql = `
        SELECT 
            ei.*, 
            COUNT(eu.event_id) AS event_vote_count
        FROM 
            event_info ei 
        LEFT JOIN 
            event_upvote eu ON ei.event_id = eu.event_id
        WHERE 
            ei.event_date < NOW() OR (ei.event_date = NOW() AND ei.event_time < CURRENT_TIME())
        GROUP BY 
            ei.event_id
        ORDER BY 
            event_vote_count DESC
    `;  
            
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

// increment on event up vote count
app.post('/addupvote', (req, res) => {
    const { eventid, username } = req.body;

    let addUpVote = `INSERT INTO event_upvote (event_id, username) VALUES (?, ?)`;
    db.query(addUpVote, [eventid, username], (err, rows) => {
        if (err) {
            console.error('Error executing query to fetch vote count:', err);
            res.status(500).json({ error: 'Internal Server Error1' });
            return;
        }
        res.status(200).json({ message: 'Successfully up voted event.' });
    });
});

// decrement on event up vote count
app.post('/removeupvote', (req, res) => {
    const { eventid, username } = req.body;

    let deleteUpVote = `
        DELETE FROM event_upvote 
        WHERE event_id = ? AND username = ?`;
    db.query( deleteUpVote,[eventid, username], (err, rows) => {
        if (err) {
            console.error('Error executing query to fetch vote count:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    });
    res.status(200).json({ message: 'Successfully removed up vote on event.' });
});


// insert user and its account upgrade request on table admin_list for approval
app.post('/upgradeaccount', (req, res) => {
    const { username, type } = req.body;

    let checkPreviousRequest = `SELECT * FROM admin_list WHERE username = ?`;
    db.query(checkPreviousRequest, [username], (err, rows) => {
        if (err) {
            console.error('Error checking previous request:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (rows.length > 0) {
            res.status(400).json({ error: 'You already have a pending request for account upgrade' });
            return;
        }

        const insertRequest = `INSERT INTO admin_list (username, request_type, is_approved) VALUES (?, ?, 0)`;
        db.query(insertRequest, [username, type], (err, result) => {
            if (err) {
                console.error('Error inserting new request:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            res.status(200).json({ message: 'Upgrade request submitted successfully' });
        });
    });
});

//insert the username and eventid on event_user_request table for approval to register on an event
app.post('/registerevent', (req, res) => {
    const { username, eventid } = req.body;

    let checkPreviousRequest = `SELECT * FROM event_user_request WHERE username = ? AND event_id = ?`;
    db.query(checkPreviousRequest, [username, eventid], (err, rows) => {
        if (err) {
            console.error('Error checking previous request:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (rows.length > 0) {
            res.status(400).json({ error: 'You already have already requested for this event' });
            return;
        }

        const insertRequest = `INSERT INTO event_user_request (event_id, username, is_accepted) VALUES (?, ?, 0)`;
        db.query(insertRequest, [eventid, username], (err, result) => {
            if (err) {
                console.error('Error inserting new request:', err);
                res.status(500).json({ error: 'Internal Server Error1' });
                return;
            }
            res.status(200).json({ message: 'Successfully requested' });
        });
    });
});

// para register sa account
app.post('/registeraccount', (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    console.log(username);

    let findUsername = `SELECT * FROM user_info WHERE username = ?`;
    db.query(findUsername, [username], (err, rows) => {
        if (err) {
            console.error('Error checking previous request:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (rows.length > 0) {
            res.status(400).json({ error: 'Username already exist' });
            return;
        }
        
        const insertRequest = `INSERT INTO user_info (username, user_type, first_name, last_name, password) VALUES (?, 0, ?, ?, ?)`;
        db.query(insertRequest, [username, firstName, lastName, password], (err, result) => {
            if (err) {
                console.error('Error inserting new request:', err);
                res.status(500).json({ error: 'Internal Server Error1' });
                return;
            }
            res.status(200).json({ message: 'Successfully registered account', user_name: username, status: 1 });
        });
    });
});

app.post('/notifications', (req, res) => {
    const { username } = req.body;

    let sql = 
        `SELECT 
            nc.notification_type,
            un.notification_info 
        FROM 
            user_notification un
        INNER JOIN 
            notification_category nc ON un.notification_category = nc.notification_id
        WHERE 
            un.username = ?`;

    db.query(sql, [username], (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const result = data.map(notification => ({
            notification: notification.notification_type, 
            text: notification.notification_info
        }));
        
        res.json(result);
    });
});

app.post('/sendnotificationuserregisterevent', (req, res) => {
    const { event_name, username, orgusername } = req.body;
    const text = `User ${username} registered to your event named ${event_name}.`;
    let sql = `INSERT INTO user_notification (username, notification_category, notification_info) VALUES (?, 8, ?)`;

    db.query(sql, [orgusername, text], (err, data) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    });
});

app.post('/approveusers', (req, res) => {
    const { eventid } = req.body;

    let sql = 
        `SELECT 
            event_id,
            username,
            is_accepted
        FROM 
            event_user_request
        WHERE 
            event_id = ? AND is_accepted = 0`;
    
    db.query( sql,[eventid], (err, data) => {
        if (err) {
            console.error('Error executing query to fetch vote count:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(data);
    });
});

app.post('/updateAcceptedStatus', (req, res) => {
    const { eventid, username } = req.body;

    let sql = `
        UPDATE event_user_request
        SET is_accepted = 1
        WHERE event_id = ? AND username = ? AND is_accepted = 0
    `;
    
    db.query(sql, [eventid, username], (err, result) => {
        if (err) {
            console.error('Error updating accepted status:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(500).json({ message: 'Accepted' + {username} +'to the event.' });
    });
    const event_name_query = `Select event_name from event_info Where event_id = ?`
    db.query(event_name_query, [eventid], (err, result) => {
        if (err) {
            console.error('Error updating accepted status:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const event_name = result[0].event_name;
        const text = `You have successfully registered to the event ${event_name}.`;
        const notif = `INSERT INTO user_notification (username, notification_category, notification_info) VALUES (?,5, ?)`;
        db.query(notif, [username, text], (err, result) => {
            if (err) {
                console.error('Error updating accepted status:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
        });
    });

    
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/events/join', (req, res) => {
    const { event_id, username } = req.body;
    const isAccepted = false;

    // Insert the join request into the event_user_request table
    let joinSql = 'INSERT INTO event_user_request (event_id, username, is_accepted) VALUES (?, ?, ?)';
    db.query(joinSql, [event_id, username, isAccepted], async (err, result) => {
        if (err) {
            console.error('Error joining event:', err);
            res.status(500).json({ error: 'Failed to join event' });
            return;
        }

        try {
            // Fetch the organizer of the event
            const organizerQuery = 'SELECT event_organizer FROM event_info WHERE event_id = ?';
            const [organizerRow] = await db.promise().query(organizerQuery, [event_id]);
            const organizer = organizerRow[0].event_organizer;

            // Insert a notification for the organizer
            const notificationQuery = 'INSERT INTO user_notification (username, notification_category, notification_info) VALUES (?, ?, ?)';
            await db.promise().query(notificationQuery, [organizer, 1, `User ${username} has requested to join your event`]);

            console.log('Notification sent to organizer');
        } catch (error) {
            console.error('Error sending notification:', error);
            // Log the error and continue, as the main functionality (joining event) has already been completed
        }

        console.log('Event join request sent successfully');
        res.json({ message: 'Event join request sent successfully' });
    });
});




app.get('/events/hasRequested/:eventId', (req, res) => {
    const { eventId } = req.params;
    const { username } = req.body;
    let sql = `
        SELECT *
        FROM event_user_request
        WHERE event_id = ? AND username = ?`;

    // Execute the SQL query
    db.query(sql, [eventId, username], (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Check if the user has already requested to join the event
        if (data.length > 0) {
            // If there's already a request, send a response indicating it
            res.json({ hasRequested: true });
        } else {
            // If there's no request, send a response indicating it
            res.json({ hasRequested: false });
        }
    });
});




app.post('/events/cancelRegistration', (req, res) => {
    try {
        const { event_id, username } = req.body;

        // Delete data from the event_attendees table based on the event ID and username
        const query = `DELETE FROM event_attendees WHERE event_id = ? AND username = ?`;
        db.query(query, [event_id, username], (error, results) => {
            if (error) {
                console.error('Error canceling registration:', error);
                res.status(500).json({ error: 'Failed to cancel registration' });
                return;
            }
            console.log('Registration canceled successfully');
            res.status(200).json({ message: 'Registration canceled successfully' });
        });
    } catch (error) {
        console.error('Error canceling registration:', error);
        res.status(500).json({ error: 'Failed to cancel registration' });
    }
});

app.post('/events/cancel', (req, res) => {
    const { eventId } = req.body;

    const notificationAttendeesSql = `
        INSERT INTO user_notification 
            (username, notification_category, notification_info)
        SELECT 
            ea.username, 
            6, 
            CONCAT(
                nc.notification_type, 
                ' ', 
                ei.event_name
            )
        FROM 
            event_attendees ea
            JOIN event_info ei ON ea.event_id = ei.event_id
            JOIN notification_category nc ON nc.notification_id = 6
        WHERE 
            ea.event_id = ?;
    `;

    const notificationRequestsSql = `
        INSERT INTO user_notification 
            (username, notification_category, notification_info)
        SELECT 
            eru.username, 
            6, 
            CONCAT(
                nc.notification_type, 
                ' ', 
                ei.event_name
            )
        FROM 
            event_user_request eru
            JOIN event_info ei ON eru.event_id = ei.event_id
            JOIN notification_category nc ON nc.notification_id = 6
        WHERE 
            eru.event_id = ?;
    `;

    const deleteAttendeesSql = `DELETE FROM event_attendees WHERE event_id = ?;`;
    const deleteRequestsSql = `DELETE FROM event_user_request WHERE event_id = ?;`;
    const deleteEventSql = `DELETE FROM event_info WHERE event_id = ?;`;


    db.query(notificationAttendeesSql, [eventId], (err, result) => {
        if (err) {
            console.error('Error inserting notification for attendees:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        db.query(notificationRequestsSql, [eventId], (err, result) => {
            if (err) {
                console.error('Error inserting notification for requests:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            db.query(deleteAttendeesSql, [eventId], (err, result) => {
                if (err) {
                    console.error('Error deleting attendees:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                db.query(deleteRequestsSql, [eventId], (err, result) => {
                    if (err) {
                        console.error('Error deleting requests:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                        return;
                    }

                    db.query(deleteEventSql, [eventId], (err, result) => {
                        if (err) {
                            console.error('Error deleting event:', err);
                            res.status(500).json({ error: 'Internal Server Error' });
                            return;
                        }

                        // If everything is successful, send success response
                        res.json({ success: true });
                    });
                });
            });
        });
    });
});

// # For What?
// app.post('/delete-notification', (req, res) => {
//     const { id } = req.body; // Assuming you send the ID of the notification to delete in the request body

//     // Find the index of the notification with the given ID
//     const index = notifications.findIndex(notification => notification.id === id);

//     // If the notification is found, remove it from the array
//     if (index !== -1) {
//         notifications.splice(index, 1);
//         res.status(200).json({ message: 'Notification deleted successfully' });
//     } else {
//         res.status(404).json({ message: 'Notification not found' });
//     }
// });


app.post('/notifications/add', (req, res) => {
    const { username, notification_category, notification_info } = req.body;

    let sql = `INSERT INTO user_notification (username, notification_category, notification_info) VALUES (?, ?, ?)`;

    db.query(sql, [username, notification_category, notification_info], (err, result) => {
        if (err) {
            console.error('Error executing query: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('Notification added successfully');
        res.status(200).json({ message: 'Notification added successfully' });
    });
});


