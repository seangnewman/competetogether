// const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const templateObjGenerator = require('./public/assets/js/helper/template/templateObj.js');
dotenv.config();

// create the server
const app = express();
const PORT = process.env.PORT || 8080;

// initialize chat connection
const http = require('http').Server(app);
const io = require('socket.io')(http);
const initChat = require('./controllers/sockets/sockets');
initChat(io);

// specify the view engine and file locations
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// static file locations
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/dist')));

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// validation middleware
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({
    secret: 'afdhu19h3f0ph10f',
    resave: false,
    saveUninitialized: false
  })
);

// authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// require all routes
app.use(require('./controllers/html-routes.js'));
app.use('/api', require('./controllers/api-routes.js'));

// 404 redirect
app.get('*', function(req, res) {
  let templateObj = templateObjGenerator();
  templateObj.page = '404';
  res.render('index', templateObj);
});

// start the server with http because socket.io is attached to it
http.listen(PORT, () => console.log('listening on ' + PORT));
