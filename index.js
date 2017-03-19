const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const index = require('./routes/index');
const admin = require('./routes/admin');
const comics = require('./routes/comics');

// Connect mongoose
mongoose.connect('mongodb://localhost/barelyamusing');
const db = mongoose.connection;

const port = 3000;
const app = express();

// Routes
app.use('/', index);
app.use('/admin', admin);
app.use('/comics', comics);

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// File Upload
app.use(fileUpload());

// Public path
app.use(express.static(path.join(__dirname, 'public')));

// Run app
app.listen(port, () => {
  console.log("Server started on port "+port)
})
