const express = require('express');


const indexRouter = require('./main');
const authRouter = require('./auth');
const newsRouter = require('./news');
const tasksRouter = require('./task');


const router = express.Router();

router.use('/auth', authRouter);
router.use('/news', newsRouter);
router.use('/task', tasksRouter);
router.use(indexRouter);

module.exports = router;