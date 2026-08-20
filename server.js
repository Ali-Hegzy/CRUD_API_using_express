const express = require('express');
const app =  express();
// const db = require("./database");
const taskRepo = require('./repositories/taskRepository');
const {supabase} = require('./src/supabaseClient');
const PORT = 3000;

app.use(express.json()); // to read the request from POST

app.get("/",(req,res)=>{
    res.status(200).json({
        name : "Task API",
        version : "1.0",
        endpoints : ["/tasks"]
    });
});

app.get("/health",(req,res)=>{
    res.status(200).json({
        status : "ok"
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

// AUTH -- JWT
app.post('/auth/signup',async (req,res)=>{
    const {email, password} = req.body;

    const {data,error} = await supabase.auth.signUp({
        email : email,
        password : password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
});

app.post('/auth/login',async (req,res)=>{
    const {email, password} = req.body;

    const {data,error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password,
    });

    if (error) 
    {
        if(error.message === "Invalid login credentials"){
            return res.status(401).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
});

app.get('/public/info',async (req, res) => {
    res.status(200).json({"message" : "Welcome stranger! This info is public."});
});

app.get('/protected/info', async (req, res) => {
    const authHeader = req.headers.authorization; // header and headers

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(' ')[1];

    const { user, error} = await supabase.auth.getUser(token);

    if(error || !user){
        return res.status(401).json({error : "Invalid or expired token"});
    }

    res.status(200).send("hello");
})

app.get('/protected/profile', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(' ')[1];

    const {data : {user} , error} = await supabase.auth.getUser(token);

    if(error || !user){
        return res.status(401).json({error : "Invalid or expired token"});
    }

    res.status(200).json({
        id : user.id,
        email : user.email,
        created_at : user.created_at
    });
})

app.listen(PORT);