const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');

const index = require('./routes/index');
const admin = require('./routes/admin');
const comics = require('./routes/comics');
const about = require('./routes/about');

// Connect mongoose
mongoose.connect('mongodb://localhost/barelyamusing');
const db = mongoose.connection;

// const port = 3000;
const app = express();

// Admin Route
app.use('/admin', admin);

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

// Routes
app.use('/', index);
app.use('/comics', comics);
app.use('/about', about);

// Public path
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
// Run app
// app.listen(port, () => {
//   console.log("Server started on port "+port)
// })
