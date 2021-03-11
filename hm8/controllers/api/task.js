const models = require('../../models');

exports.getTasks = (req, res, next) => {
    models.Task.getTasks().then(([data]) => {
        res.json({ tasks: data})
    })
};

exports.createTask = (req, res, next) => {
    models.Task.createTask(req.body).then(([data]) => {
        res.json({Status: "Task created", taskId: data.insertId})
    })
};

exports.updateTaskDescription = (req, res, next) => {
    models.Task.updateTask(req.params.taskId, req.body).then(([data]) => {
        res.json({Status: 'Description update', description: data.description})
    })
};

exports.completeTask = (req, res, next) => {
    models.Task.completeTask(req.params.taskId, req.body).then(([data]) => {
        res.json({Status: 'Complete', taskId: data.insertId})
    })
};

exports.deleteTask = (req, res, next) => {
    models.Task.deleteTask(req.params.taskId).then(([data]) => {
        res.json({Status: 'Task delete', taskId: data})
    })
};