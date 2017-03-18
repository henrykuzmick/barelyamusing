const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const index = require('./routes/index');

// Connect mongoose
mongoose.connect('mongodb://localhost/barelyamusing');
const db = mongoose.connection;

const port = 3000;
const app = express();


// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Public path
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);

// Run app
app.listen(port, () => {
  console.log("Server started on port "+port)
})
