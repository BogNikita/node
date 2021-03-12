const express = require('express');


const authApiRouter = require('./auth');
const newsApiRouter = require('./news');
const tasksApiRouter = require('./task');

const router = express.Router();

router.use('/auth', authApiRouter);
router.use('/news', newsApiRouter);
router.use('/task', tasksApiRouter);

module.exports = router;