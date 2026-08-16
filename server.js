const express = require('express');
const app =  express();
// const db = require("./database");
const taskRepo = require('./repositories/taskRepository');
const PORT = 3000;

app.use(express.json()); // to read the request from POST

app.get("/",(req,res)=>{
    res.status(200).json({
        name : "Task API",
        version : "1.0",
        endpoints : ["/tasks"]
    });
});

app.get("/tasks",async (req,res) => {
    const tasks = await taskRepo.getAllTasks();

    res.status(200).json(tasks);
});

app.get("/tasks/:id",async (req,res) => {
    const id = parseInt(req.params.id);
    const task = await taskRepo.getTask(id);

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

app.post("/tasks",async (req,res) => {
    const { title } = req.body;

    if(!title || typeof title !== "string" || title.trim() === ''){
        return res.status(404).json({
            error : `Missing title`
        });
    }

    const task = await taskRepo.createTask(title);

    res.status(201).json(task);
});

app.put("/tasks/:id",async (req,res) => {
    const id = parseInt(req.params.id);
    const { title, done } = req.body;
    
    if(!title || typeof title !== "string" || title.trim() === '' || typeof done != "boolean"){
        return res.status(400).json({
            error : `Invalid body`
        });
    }

    const task = await taskRepo.updateTask(title, done, id);

    if(task.changes === 0){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }

    res.json(task);
});

app.delete("/tasks/:id",async (req,res) => {
    const id = parseInt(req.params.id);
    const task = await taskRepo.deleteTask(id);

    if(!task){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }

    res.status(204).send();
});

app.listen(PORT);