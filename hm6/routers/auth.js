const express = require('express');
const controllers = require('../controllers');
const passport = require('passport');

const router = express.Router();

router.get('/login/', controllers.auth.getLogin);
router.post('/login/', controllers.auth.postLogin);
router.post('/logout/', controllers.auth.postLogout);
router.get('/signup/', controllers.auth.getSignup);
router.post('/signup/', controllers.auth.postSignup);
router.get('/login/yandex', passport.authenticate('yandex'));
router.get('/login/yandex/callback', passport.authenticate('yandex'), controllers.auth.yandex);

module.exports = router;