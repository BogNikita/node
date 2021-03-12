const models = require('../models');

exports.getTasks = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/auth/login/')
    } else {
        models.Task.getTasks().then(([data]) => {
        res.render('tasks', {tasks: data})
        })
    }
    
};

exports.createTask = (req, res, next) => {
    models.Task.createTask(req.body).then(([data]) => {
        res.redirect('/task/')
    })
};

exports.updateTaskDescription = (req, res, next) => {
    models.Task.updateTask(req.params.taskId, req.body).then(([data]) => {
        res.redirect('/task/')
    })
};

exports.completeTask = (req, res, next) => {
    models.Task.completeTask(req.params.taskId, req.body).then(([data]) => {
        res.redirect('/task/')
    })
};

exports.deleteTask = (req, res, next) => {
    models.Task.deleteTask(req.params.taskId).then(([data]) => {
        res.redirect('/task/')
    })
};