const db = require('./db');
const config = require('../config');
const fs = require('fs');


const Task = {
    async init() {
        if (config.db.cleanOnStatup) {
            await db.execute('drop table if exists todo_list');
        };

        await db.execute(`
        CREATE TABLE todo_list (
            id int NOT NULL AUTO_INCREMENT,
            task varchar(45) NOT NULL,
            description varchar(255) DEFAULT NULL,
            complete tinyint DEFAULT '0',
            PRIMARY KEY (id),
            UNIQUE KEY id_UNIQUE (id)
          );
          `)
        
        if (config.db.loadMockupData) {
            const mockups = JSON.parse(fs.readFileSync('./models/mockups/tasks.json', 'utf8'));
            mockups.forEach(async (mockups) => {
                await Task.createTask(mockups);
            });
        };
    },

    async getTasks() {
        const tasks = await db.query('select * from todo_list');
        return tasks
    },

    async createTask(task) {
        const newTask = await db.query('insert into todo_list values(default, ?, ?, ?)', [task.task, task.description, task.complete=='true'?1:0]);
        return newTask
    },

    async updateTask(taskId, task) {
        const res = await db.query('update todo_list set description=? WHERE id=?', [task.description, taskId]);
        return res
    },

    async completeTask(taskId, task) {
        const res = await db.query('update todo_list set complete=? WHERE id=?', [task.complete=='true'?1:0, taskId]);
        return res
    },

    async deleteTask(taskId) {
        const res = await db.query('delete from todo_list WHERE id =? LIMIT 1', [taskId]);
        return res
    }

}

module.exports = Task;