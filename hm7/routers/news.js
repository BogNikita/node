const express = require('express');
const controllers = require('../controllers');

const router = express.Router();

router.get('/', controllers.news.getNewsPage);
router.post('/', controllers.news.getNews)

module.exports = router;