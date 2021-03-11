const express = require('express');
const controllers = require('../../controllers');

const router = express.Router();

router.post('/', controllers.api.news.getNews)

module.exports = router;