exports.getChat = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/auth/login/')
    } else {
        res.render('chat', {});
    }
};