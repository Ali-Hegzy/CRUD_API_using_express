const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const llmRoutes = require('./routes/llmRoutes');
const app =  express();

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

app.use('/tasks',taskRoutes);
app.use('/auth',authRoutes);
app.use('/llm',llmRoutes);

module.exports = app;
