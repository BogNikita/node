exports.indexPage = (req, res, next) => {
    if (!req.session.user) {
        res.render('index');
    } else {
        res.render('index', {name: req.session.user})
    }
};