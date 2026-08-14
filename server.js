const express = require('express');
const app =  express();
const PORT = 3000;

app.use(express.json()); // to read the request from POST

const tasks = [
    {
        id : 1,
        title : "task1",
        done : true,
    },
    {
        id : 2,
        title : "task2",
        done : true,
    },
    {
        id : 3,
        title : "task3",
        done : false,
    },
];

app.get("/",(req,res)=>{
    res.status(200).json({
        name : "Task API",
        version : "1.0",
        endpoints : ["/tasks"]
    });
});

app.get("/tasks",(req,res) => {
    res.status(200).json(tasks);
});

app.get("/tasks/:id",(req,res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

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
    const id = tasks.at(-1).id + 1;
    const { title } = req.body;

    const task = {
        id : id,
        title : title,
        done : false
    };

    tasks.push(task);

    res.status(201).json(task);
});

app.listen(PORT);