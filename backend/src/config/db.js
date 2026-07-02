const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function connectDB() {
    try {
        const dbPath = path.join(__dirname, '../database.db');
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        return db;
    } catch (error) {
        console.error('[DB ERROR] Gagal konek:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;