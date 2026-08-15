const Database = require('better-sqlite3');

const db = new Database('tasks.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(255) NOT NULL,
        DONE INTEGER DEFAULT 0
    )
    `);

db.exec(`
    INSERT INTO tasks (title)
    SELECT 'task1'
    WHERE NOT EXISTS (SELECT * FROM tasks)
    UNION ALL
    SELECT 'task2'
    WHERE NOT EXISTS (SELECT * FROM tasks)
    UNION ALL
    SELECT 'task3'
    WHERE NOT EXISTS (SELECT * FROM tasks)
    `)

module.exports = db;