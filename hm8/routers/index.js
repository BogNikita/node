const express = require('express');


const indexRouter = require('./main');
const authRouter = require('./auth');
const newsRouter = require('./news');
const tasksRouter = require('./task');
const chatRouter = require('./chat');
const apiRouter = require('./api');


const router = express.Router();

router.use('/auth', authRouter);
router.use('/news', newsRouter);
router.use('/task', tasksRouter);
router.use('/chat', chatRouter);
router.use('/api', apiRouter);
router.use(indexRouter);

module.exports = router;