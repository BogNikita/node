const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.use('/', controllers.chat.getChat);

module.exports = router;