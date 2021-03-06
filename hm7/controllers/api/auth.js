const models = require('../../models');

exports.postLogin = (req, res, next) => {
    models.User.findUserByName(req.body.user).then(([user, fieldData]) => {
        if (user.length>0) {
            user = user[0];
            
            if (models.User.checkPassword(user, req.body.password)) {
                if (req.body.save) {
                    res.cookie('user', req.body.user)
                }
                req.session.user = req.body.user;
                res.json({title: "Вы вошли", user: req.body.user});    
            } else {
                res.json({title: "Неверный пароль"})
            }
        } else {
            res.json({title: "Неверное имя пользователя"});
        }
    })
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.json({title: "Вы вышли"});
    });
};


exports.postSignup = (req, res, next) => {
    res.cookie('user', req.body.user);
    models.User.createUser(req.body);
    res.json({title: "Создан новый пользователь", user: req.body.user});
};
