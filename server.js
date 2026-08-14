const express = require('express');
const app =  express();
const PORT = 3000;

app.get("/",(res,req)=>{
    req.send('Hello world');
});


app.listen(PORT);