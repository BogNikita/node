const mysql = require('mysql2');
const config = require('../config');

const pool = mysql.createPool(config.mysql.config).promise();

module.exports = pool;