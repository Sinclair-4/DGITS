const sqlite = require('better-sqlite3');
const path = require('path');

const db = new sqlite(path.join(__dirname, '..', 'data', 'database.db'));

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

function initUsersTable() {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                ver INTEGER DEFAULT 1
            )
        `);

        db.exec(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL UNIQUE,
                user_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME,
                is_valid BOOLEAN DEFAULT 1,
                ver INTEGRER,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )    
        `)
    }
    catch (err) {
        throw new Error(err.message);
    }
}; 

initUsersTable();

module.exports = db;