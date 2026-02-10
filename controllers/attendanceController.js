const db = require('../config/db');

exports.checkIn = (req, res) => {
    const userId = req.session.user ? req.session.user.id : req.body.userId;
    // For simplicity, we assume the user checks in once per day.
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0];

    // Check for existing attendance
    const checkSql = 'SELECT * FROM attendance WHERE user_id = ? AND date = ?';
    db.query(checkSql, [userId, today], (checkErr, checkResult) => {
        if (checkErr) {
            return res.status(500).json({ error: checkErr.message });
        }

        if (checkResult.length > 0) {
            return res.status(400).json({ message: 'Attendance already marked for today' });
        }

        // Check if user is on leave
        // Optional enhancement: Check leaves table too, but for now just duplicate check as requested.

        const sql = 'INSERT INTO attendance (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)';
        db.query(sql, [userId, today, time, 'Present'], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Checked in successfully' });
        });
    });
};

exports.getAttendance = (req, res) => {
    const userId = req.params.userId;
    const sql = 'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.getAllAttendance = (req, res) => {
    // Admin only
    const sql = 'SELECT attendance.*, users.name FROM attendance JOIN users ON attendance.user_id = users.id ORDER BY date DESC';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};
