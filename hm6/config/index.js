const mysql = require('./mysql.js');
const db = require('./db');
const session = require('./session');
const bcryptjs = require('./bcryptjs');
const auth = require('./authyandex')

module.exports = {
    db, mysql, session, bcryptjs, auth
};