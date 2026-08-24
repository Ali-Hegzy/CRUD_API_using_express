const taskRepo = require('../repositories/taskRepository');

exports.getAllTasks = async (req, res) => {
    const tasks = await taskRepo.getAllTasks();

    res.status(200).json(tasks);
}

exports.getTaskById = async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await taskRepo.getTask(id);

    if (!task){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }

    res.status(200).json(task);
}

exports.createTask = async (req, res) => {
    const { title } = req.body;

    if(!title || typeof title !== "string" || title.trim() === ''){
        return res.status(404).json({
            error : `Missing title`
        });
    }

    const task = await taskRepo.createTask(title);

    res.status(201).json(task);
}

exports.updateTask = async (req, res) => {
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
}

exports.deleteTask = async (req, res) => {
    const id = parseInt(req.params.id);
    const task = await taskRepo.deleteTask(id);

    if(!task){
        return res.status(404).json({
            error : `Task ${id} not found`
        });
    }

    res.status(204).send();
}