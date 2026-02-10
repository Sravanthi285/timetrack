const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

// Wrapper to mimic MySQL's query interface
const dbWrapper = {
    query: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }

        // Simple heuristic: SELECT uses .all(), otherwise use .run()
        const command = sql.trim().split(' ')[0].toUpperCase();

        if (command === 'SELECT') {
            db.all(sql, params, (err, rows) => {
                if (callback) callback(err, rows);
            });
        } else {
            db.run(sql, params, function (err) {
                if (callback) {
                    // Mimic mysql result object
                    const result = {
                        insertId: this.lastID,
                        affectedRows: this.changes
                    };
                    callback(err, result);
                }
            });
        }
    }
};

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'EMPLOYEE',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Attendance Table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            check_in_time TEXT,
            status TEXT DEFAULT 'Present',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Leaves Table
        db.run(`CREATE TABLE IF NOT EXISTS leaves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            from_date TEXT NOT NULL,
            to_date TEXT NOT NULL,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Create Admin if not exists
        const checkAdmin = "SELECT * FROM users WHERE email = ?";
        db.get(checkAdmin, ['admin@timetrack.com'], (err, row) => {
            if (!row) {
                const insertAdmin = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
                db.run(insertAdmin, ['Admin User', 'admin@timetrack.com', 'admin123', 'ADMIN'], (err) => {
                    if (err) console.error(err.message);
                    else console.log('Default Admin created.');
                });
            }
        });
    });
}

module.exports = dbWrapper;
