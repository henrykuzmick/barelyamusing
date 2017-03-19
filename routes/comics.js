const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');

router.get('/', (req, res, next) => {
  Comic.getLatest().then((comics) => {
    res.redirect(`/comics/${comics[0].url}`);
  });
});

router.get('/random', (req, res, next) => {
  Comic.getRandom().then((comics) => {
    res.redirect(`/comics/${comics[0].url}`);
  });
});

router.get('/:url', (req, res, next) => {
  Comic.getComic(req.params.url).then((comic) => {
    const id = comic._id;
    Promise.all([Comic.getPrev(id), Comic.getNext(id)])
      .then((prevnext) => {
        const prev = prevnext[0];
        const next = prevnext[1];
        res.render('comic', {
          comic,
          prev,
          next
        });
      })
  })
});

module.exports = router;
