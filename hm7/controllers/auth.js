const models = require('../models');
const config = require('../config');

exports.getLogin = (req, res, next) => {
    res.render('login', {
        user: req.cookies ? req.cookies.user || '' : ''});
};

exports.postLogin = (req, res, next) => {
    const user = models.User.findUserByName(req.body.user).then(([user, fieldData]) => {
        if (user.length>0) {
            user = user[0];
            console.log(user);
            
            if (models.User.checkPassword(user, req.body.password)) {
                if (req.body.save) {
                    res.cookie('user', req.body.user)
                }
                req.session.user = req.body.user;
                res.redirect('/');    
            } else {
                res.redirect('/auth/login/')
            }
        } else {
            res.redirect('/auth/login/');
        }
    })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    res.render('signup', {});
};

exports.postSignup = (req, res, next) => {
    res.cookie('user', req.body.user);
    models.User.createUser(req.body);
    res.redirect('/auth/login/');
};

exports.yandex = (req, res, next) => {
    req.session.user = req.user.id;
    res.cookie('user', req.user._json.login)
    models.User.createUser(req.user);
    res.redirect('/');
};