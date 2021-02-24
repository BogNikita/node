const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const handlebars = require('handlebars');
var templating = require('consolidate');
const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

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

const getNews = (url, target) => axios.get(url)
    .then(res => {
        const news = [];
        const $ = cheerio.load(res.data)
        $(target).each(function (i, element) {
            news.push($(this).text())
        });
        return news  
    })
    .catch(err => (err.message))

app.post('/news', async (req, res) => {
    res.setHeader('Set-Cookie', [`site=${req.body.linkNews}`, `count=${req.body.value}`])
    if (req.body.linkNews === '') res.render('news', {error: 'Выберите новостой сайт'}) 
    else {
        const {site, target} = libraryNews[req.body.linkNews];
        const news = await getNews(site, target);
        let count = req.body.value;
        if (count > news.length) {
            count = news.length;
        }
        news.length = count;
        typeof news === 'string' 
        ? res.render('news', {error: news})
        : res.render('news', {news})
    }
})


app.listen(3000, () => console.log('Listening on port 3000'));