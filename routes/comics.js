const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');

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
