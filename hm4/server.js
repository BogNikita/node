const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const handlebars = require('handlebars');
const templating = require('consolidate');
const cookieParser = require('cookie-parser');



const app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 == v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

const getNews = (url, target) => axios.get(url)
    .then(res => {
        const news = [];
        const $ = cheerio.load(res.data)
        $(target).each(function (i, element) {
            news.push($(this).text())
        });
        return news  
    })
    .catch(err => (err.message));

const setCookie = (req, res) => {
    if(!req.cookies || !req.cookies.site || req.body.site !== req.cookies.site) {
        res.cookie('site', req.body.site)
    }
    if(!req.cookies || !req.cookies.count || req.body.count !== req.cookies.count) {
        res.cookie('count', req.body.count)
    }
};

app.get('/', (req, res) => {
    res.redirect('/news')
});     

app.get('/news', (req, res) => {
    res.render('news', {
        site: req.cookies ? req.cookies.site || '' : '',
        count: req.cookies ? req.cookies.count || '1' : '1',
    })
})

app.post('/news', async (req, res) => {

    setCookie(req, res);
    if (req.body.site === '') res.render('news', {error: 'Выберите новостой сайт'}) 
    else {
        const {site, target} = libraryNews[req.body.site];
        const news = await getNews(site, target);
        let count = req.body.count;
        if (count > news.length) {
            count = news.length;
        }
        news.length = count;
        typeof news === 'string' 
        ? res.render('news', {error: news})
        : res.render('news', {news, count, site: req.body.site})
    }
})


app.listen(3000, () => console.log('Listening on port 3000'));