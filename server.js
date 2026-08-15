const express = require('express');
const app =  express();
const db = require("./database");
const PORT = 3000;

app.use(express.json()); // to read the request from POST

app.get("/",(req,res)=>{
    res.status(200).json({
        name : "Task API",
        version : "1.0",
        endpoints : ["/tasks"]
    });
});

app.get("/tasks",(req,res) => {
    const stmt = db.prepare('SELECT * FROM tasks');
    const tasks = stmt.all();

    res.status(200).json(tasks);
});

app.get("/tasks/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
    const task = stmt.get(id);

    if (!task){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }

    res.status(200).json(task);
});

app.get("/health",(req,res)=>{
    res.status(200).json({
        status : "ok"
    });
});

app.post("/tasks",(req,res) => {
    const { title } = req.body;

    if(!title || typeof title !== "string" || title.trim() === ''){
        return res.status(404).json({
            error : `Missing title`
        });
    }

    const stmt = db.prepare("INSERT INTO tasks (title) VALUES (?) ");
    const task = stmt.run(title);

    res.status(201).json(task);
});

app.put("/tasks/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    const { title, done } = req.body;

    if(!task){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }
    
    if(!done || !title){
        return res.status(400).json({
            error : `Invalid body`
        });
    }

    task.done = done;
    task.title = title;

    res.json(task);
});

app.delete("/tasks/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        tasks.splice(index,1);
    }

    res.status(204).json({
        status : "Item deleted successfully"
    });
});

app.listen(PORT);