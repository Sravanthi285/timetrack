const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Default XAMPP/MySQL user
    password: 'shravs123', // Updated with user provided password
    database: 'timetrack'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database: timetrack');
    }
});

module.exports = db;
