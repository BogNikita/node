const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.use('/', controllers.main.indexPage);

module.exports = router;