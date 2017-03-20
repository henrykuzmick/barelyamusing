const express = require('express');
const passport = require('passport');
const multer = require('multer');
const mkdirp = require('mkdirp');
const Comic = require('../models/comic');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let dest;
    if(req.body.url) {
      dest = 'comics/' + req.body.url;
    } else {
      dest = 'comics/' + slugify(req.body.title);
    }
    mkdirp.sync(dest);
    callback(null, dest);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({ storage }).any()

router.get('/comics', ensureAuthenticated, (req, res, next) => {
  Comic.getComics((err, comics) => {
    if(err) {
      res.send(err);
    }
    res.render('admin_comics', {
      title: 'Barely Amusing - New Comic',
      comics
    });
  });
});

router.get('/comics/add', ensureAuthenticated, (req, res, next) => {
  res.render('add_comic', { title: 'Barely Amusing - New Comic' });
});

router.get('/comics/edit/:url', ensureAuthenticated, (req, res, next) => {
  Comic.getComic(req.params.url).then((comic) => {
    res.render('edit_comic', {
      title: `Barely Amusing - ${comic.title}`,
      comic
    });
  })
});


router.post('/comics/add', ensureAuthenticated, function(req,res){
  let comic = new Comic();
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    comic.title = req.body.title;
    comic.tags = req.body.tags.split(',');
    comic.comment = req.body.comment;
    comic.url = slugify(req.body.title);
    comic.favorite = req.body.favorite;
    comic.fb = `comics/${comic.url}/fb.png`;
    comic.long = `comics/${comic.url}/long.png`;
    comic.main = `comics/${comic.url}/main.png`;
    comic.thumb = `comics/${comic.url}/thumb.png`;
    Comic.addComic(comic, (err) => {
      if(err) {
        res.send(err);
      }
      res.redirect('/admin/comics');
    })
  });
});

router.post('/comics/edit/:url', ensureAuthenticated, function(req, res) {
  let comic = {}
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    comic.title = req.body.title;
    comic.tags = req.body.tags.split(',');
    comic.comment = req.body.comment;
    comic.favorite = req.body.favorite;
    comic.url = req.body.url;
    comic.fb = `comics/${comic.url}/fb.png`;
    comic.long = `comics/${comic.url}/long.png`;
    comic.main = `comics/${comic.url}/main.png`;
    comic.thumb = `comics/${comic.url}/thumb.png`;
    Comic.editComic(req.params.url, comic, (err) => {
      if(err) {
        res.send(err);
      }
      res.redirect('/admin/comics');
    })
  });
});

// router.post('/comics/delete/:url', ensureAuthenticated, function(req, res) {
//
// });

const slugify = function(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}

module.exports = router;
