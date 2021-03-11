const express = require('express');
const handlebars = require('handlebars');
const templating = require('consolidate');
const router = require('./routers');
const initdb = require('./models/initdb');
const registerHelpers = require('./views/helpers');
const middlewares= require('./middlewares');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;
const config = require('./config/');


initdb();

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passport.use(new YandexStrategy(config.auth,
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
        })
    }    
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


app.use(passport.initialize());
app.use(passport.session());

templating.requires.handlebars = handlebars;

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

registerHelpers();

app.use(middlewares.sessionMiddleware);
app.use(middlewares.logSession)

app.use(router);

app.listen(3000, () => {
    console.log('Server listening on localhost 3000');
});

