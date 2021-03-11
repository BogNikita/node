const session = require('express-session');
const config = require('../config');
const db = require('../models/db')
const sessionStore = new (require('express-mysql-session')(session))({}, db)

exports.sessionMiddleware = session({store: sessionStore, ...config.session})

exports.logSession = (req, res, next) => {
    // console.log('Session:', req.session);
    next();
}