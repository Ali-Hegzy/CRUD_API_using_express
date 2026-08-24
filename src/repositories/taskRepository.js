const { Pool } = require('pg');

const pool = new Pool({
    connectionString : process.env.DATABASE_URL
});

module.exports = {
    async getAllTasks(){
        const {rows} = await pool.query('SELECT * FROM tasks');
        return rows;
    },

    async getTask(id){
        const {rows} = await pool.query('SELECT * FROM tasks WHERE id = $1',[id]);
        return rows[0];
    },

    async createTask(title){
        const { rows } = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *',[title]);
        return rows;
    },

    async updateTask(title, done, id){
        const { rows } = await pool.query('UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',[title, done, id]);
        return rows;
    },

    async deleteTask(id){
        const { rows } = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *',[id]);
        return rows[0];
    }

}