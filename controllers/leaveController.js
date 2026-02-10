const db = require('../config/db');

exports.applyLeave = (req, res) => {
    const { userId, fromDate, toDate, reason } = req.body;
    const sql = 'INSERT INTO leaves (user_id, from_date, to_date, reason) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, fromDate, toDate, reason], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Leave application submitted' });
    });
};

exports.getUserLeaves = (req, res) => {
    const userId = req.params.userId;
    const sql = 'SELECT * FROM leaves WHERE user_id = ? ORDER BY created_at DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getAllLeaves = (req, res) => {
    const sql = 'SELECT leaves.*, users.name FROM leaves JOIN users ON leaves.user_id = users.id ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.approveLeave = (req, res) => {
    const leaveId = req.params.id;
    const sql = "UPDATE leaves SET status = 'Approved' WHERE id = ?";
    db.query(sql, [leaveId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Leave approved' });
    });
};

exports.rejectLeave = (req, res) => {
    const leaveId = req.params.id;
    const sql = "UPDATE leaves SET status = 'Rejected' WHERE id = ?";
    db.query(sql, [leaveId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Leave rejected' });
    });
};
