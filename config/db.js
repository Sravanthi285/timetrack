const path = require('path');

let db;

// CHECK: Do we have MySQL credentials?
if (process.env.DB_HOST) {
    // --- MySQL Mode ---
    const mysql = require('mysql2');
    console.log('Environment detected: Using MySQL Database');

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // Wrapper to unify API
    db = {
        query: (sql, params, callback) => {
            pool.query(sql, params, (err, results) => {
                if (callback) callback(err, results);
            });
        }
    };

    // Auto-init tables for MySQL
    // Note: In production MySQL, it's better to run migrations manually, 
    // but for this portfolio self-healing behavior, we'll run a check.
    // (Simulating init by just ensuring connection works)
    pool.getConnection((err, connection) => {
        if (err) console.error('MySQL Connection Error:', err);
        else {
            console.log('Connected to MySQL successfully.');
            connection.release();
        }
    });

} else {
    // --- SQLite Mode (Fallback/Dev) ---
    console.log('No MySQL Config detected: Using SQLite (Embedded)');
    const sqlite3 = require('sqlite3').verbose();
    const dbPath = path.resolve(__dirname, '../database.sqlite');

    const sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) console.error('Error opening SQLite: ' + err.message);
        else {
            console.log('Connected to SQLite.');
            initSqlite(sqliteDb);
        }
    });

    db = {
        query: (sql, params, callback) => {
            if (typeof params === 'function') { callback = params; params = []; }
            const command = sql.trim().split(' ')[0].toUpperCase();
            if (command === 'SELECT') {
                sqliteDb.all(sql, params, (err, rows) => { if (callback) callback(err, rows); });
            } else {
                sqliteDb.run(sql, params, function (err) {
                    if (callback) {
                        callback(err, { insertId: this.lastID, affectedRows: this.changes });
                    }
                });
            }
        }
    };
}

function initSqlite(targetDb) {
    targetDb.serialize(() => {
        targetDb.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'EMPLOYEE',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        targetDb.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            check_in_time TEXT,
            status TEXT DEFAULT 'Present',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);
        targetDb.run(`CREATE TABLE IF NOT EXISTS leaves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            from_date TEXT NOT NULL,
            to_date TEXT NOT NULL,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

        // Default Admin
        targetDb.get("SELECT * FROM users WHERE email = ?", ['admin@timetrack.com'], (err, row) => {
            if (!row) {
                targetDb.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                    ['Admin User', 'admin@timetrack.com', 'admin123', 'ADMIN']);
            }
        });
    });
}

module.exports = db;
