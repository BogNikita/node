const cheerio = require('cheerio');
const axios = require('axios');

const libraryNews = {
    '1': {
        site: 'https://yandex.ru/',
        target: '.news__item-content'
    },
    '2': {
        site: 'https://lenta.ru/',
        target: '.item'
    },
    '3': {
        site: 'https://t.rbc.ru/',
        target: '.main__feed__title'
    },
};

const newsSite = (url, target) => axios.get(url)
    .then(res => {
        const newsArray = [];
        const $ = cheerio.load(res.data)
        $(target).each(function (i, element) {
            newsArray.push($(this).text())
        });
        return newsArray
    })
    .catch(err => (err.message));

exports.getNews = async (req, res, next) => {
    if (req.body.site === '') res.json({ error: 'Выберите новостой сайт' })
    else {
        const { site, target } = libraryNews[req.body.site];
        const news = await newsSite(site, target);
        let count = req.body.count;
        if (count > news.length) {
            count = news.length;
        }
        news.length = count;
        typeof news === 'string'
            ? res.json({ error: news })
            : res.json({ news })
    }
};