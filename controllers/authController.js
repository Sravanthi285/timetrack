const db = require('../config/db');

exports.register = (req, res) => {
    const { name, email, password, role } = req.body;
    // Simple registration without hashing as requested
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, role || 'EMPLOYEE'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = results[0];
        req.session.user = user;
        res.json({ message: 'Login successful', user });
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
};
