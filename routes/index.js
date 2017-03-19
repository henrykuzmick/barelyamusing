const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');
const User = require('../models/user');
const Authentication = require('../controllers/authentication');
const passportService = require('../services/passport');
const jwt = require('jwt-simple');
const config = require('../config');

router.get('/', (req, res, next) => {
  Comic.getComics((err, comics) => {
    if(err) {
      res.send(err);
    }
    const random = getRandomArrayElements(comics, 4);
    const latest = comics.slice(3).reverse();
    res.render('index', {
      title: 'Barely Amusing',
      comics,
      random,
      latest
    });
  });
});

router.post('/signup', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if(!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with the given email exists
  User.findOne({ email }, function(err, existingUser) {
    if(err) { return next(err); }
    if(existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }
    const user = new User({
      email,
      password
    });
    user.save(function(err) {
      if(err) { return next(err); }
      res.cookie('token', tokenForUser(user));
      res.redirect('/admin/comics/');
    });
  });
});

router.get('/signup', (req, res, next) => {
  res.render('signup', { title: 'Barely Amusing - Signup' });
});


module.exports = router;

const getRandomArrayElements = function(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}
