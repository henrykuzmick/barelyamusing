const express = require('express');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Comic = require('../models/comic');
const User = require('../models/user');
const config = require('../config');
const router = express.Router();

router.get('/', (req, res, next) => {
  Comic.getComics((err, comics) => {
    if(err) {
      res.send(err);
    }
    const random = getRandomArrayElements(comics, 4);
    const latest = comics.slice(-3).reverse();
    res.render('index', {
      title: 'Barely Amusing',
      comics,
      random,
      latest
    });
  });
});

// router.post('/signup', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
//
//   req.checkBody('email', 'Email is required').notEmpty();
//   req.checkBody('email', 'Email must be valid').isEmail();
//   req.checkBody('password', 'Password is required').notEmpty();
//
//   let errors = req.validationErrors();
//
//   if(errors) {
//     res.render('signup', {
//       title: 'Barely Amusing - Sign up',
//       errors
//     });
//   } else {
//     const newUser = new User({
//       email, password
//     });
//
//     User.signupUser(newUser, (err, user) => {
//       if(err) throw err;
//       res.redirect('/admin/comics')
//     })
//   }
// });
//
// router.get('/signup', (req, res, next) => {
//   res.render('signup', {
//     title: 'Barely Amusing - Signup',
//     errors: false
//   });
// });

router.get('/signin', (req, res, next) => {
  res.render('signin', {
    title: 'Barely Amusing - Sign In',
    errors: false
  });
});

router.get('/signout', (req, res, next) => {
  req.logout();
  res.redirect('/')
});

passport.use(new localStrategy((username, password, done) => {
  User.getUserByEmail(username, (err, user) => {
    if(err) throw err;
    if(!user) {
      return done(null, false, {message: 'No user found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'Wrong Password'});
      }
    })
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user)
  });
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect:'/admin/comics',
    failureRedirect:'/signin',
    failureFlash: true
  })(req, res, next);
})


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
