const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config');

const index = require('./routes/index');
const admin = require('./routes/admin');
const comics = require('./routes/comics');
const about = require('./routes/about');

// Connect mongoose
mongoose.connect('mongodb://localhost/barelyamusing');
const db = mongoose.connection;

const app = express();

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Session
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true
}))

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Express Messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Expres Validator
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Routes
app.use('/', index);
app.use('/comics', comics);
app.use('/about', about);
app.use('/admin', admin);

// Public path
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
