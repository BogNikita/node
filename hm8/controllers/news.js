const cheerio = require('cheerio');
const axios = require('axios');

exports.getNewsPage = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/auth/login/')
    } else {
        res.render('news', {
            site: req.cookies ? req.cookies.site || '' : '',
            count: req.cookies ? req.cookies.count || '1' : '1'
        })
    }
};

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


const setCookie = (req, res) => {
    if (!req.cookies || !req.cookies.site || req.body.site !== req.cookies.site) {
        res.cookie('site', req.body.site)
    }
    if (!req.cookies || !req.cookies.count || req.body.count !== req.cookies.count) {
        res.cookie('count', req.body.count)
    }
};

exports.getNews = async (req, res, next) => {
    setCookie(req, res)
    if (req.body.site === '') res.render('news', { error: 'Выберите новостой сайт' })
    else {
        const { site, target } = libraryNews[req.body.site];
        const news = await newsSite(site, target);
        let count = req.body.count;
        if (count > news.length) {
            count = news.length;
        }
        news.length = count;
        typeof news === 'string'
            ? res.render('news', { error: news })
            : res.render('news', { news, count, site: req.body.site })
    }
};