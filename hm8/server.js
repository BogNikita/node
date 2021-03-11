const express = require('express');
const handlebars = require('handlebars');
const templating = require('consolidate');
const router = require('./routers');
const initdb = require('./models/initdb');
const registerHelpers = require('./views/helpers');
const middlewares = require('./middlewares');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;
const config = require('./config/');


initdb();

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

passport.use(new YandexStrategy(config.auth,
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    })
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
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
app.use(middlewares.logSession);

io.use((socket, next) => {
  middlewares.sessionMiddleware(socket.request, {}, next)
});

const users = [];

io.on('connection', socket => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log(('Unautorised user connected!'));
    socket.disconnect();
    return;
  }

  console.log('Chat user connected', socket.request.session.user);

  if (!users.includes(socket.request.session.user)) {
    users.push(socket.request.session.user);
  };
  

  socket.on('disconnect', () => {
    const find = users.findIndex(user => user == socket.request.session.user);
    users.splice(find, 1);
    console.log('Chat user disconnected', socket.request.session.user);
  });
  
  io.emit('connection', users)

  socket.on('chatMessage', (data) => {
    console.log('Chat message from', socket.request.session.user + ':', data);
    data.message = socket.request.session.user + ': ' + data.message;
    io.emit('chatMessage', data);
    // console.log(io.sockets.sockets);
  });

})

app.use(router);

http.listen(3000, () => {
  console.log('Server listening on localhost 3000');
});

