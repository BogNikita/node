const config = require('../config');
const db = require('./db');
const Task = require('./task');
const User = require('./user');

module.exports = async function initDB() {
    await Task.init();
    await User.init();
}