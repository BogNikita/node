const mysql = require('mysql2');
const options = require('./config');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const pool = mysql.createPool(options).promise();

const select = 'select * from todo_list';
const insert = 'insert into todo_list values(default, ?, default, default)';
const changeTask = 'update todo_list set description=? WHERE id=?';
const completeTask = 'update todo_list set complete=1 WHERE id=?';
const deleteTask = 'delete from todo_list WHERE id =? LIMIT 1;'


const Tasks = {
    list: function(callback) {
      return pool.query(callback)
    },
    add: function(task, callback) {
      return pool.query(callback, [task])
    },
    change: function(id, text, callback) {
      return pool.query(callback, [text, id])
    },
    complete: function(id, callback) {
      return pool.query(callback, [id])
    },
    delete: function(id, callback) {
      return pool.query(callback, [id])
    }
};

(async function () {
  try {
    await Tasks.add('task from tasks.list', insert);
    await Tasks.change(9, 'change descrip', changeTask);
    await Tasks.complete(9, completeTask);
    await Tasks.delete(9, deleteTask)
    const [data] = await Tasks.list(select);
    console.log(data);
  } catch(e) {
      console.log('error', e);
  } finally {
    pool.end()
  }
})()



