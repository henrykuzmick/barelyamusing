const express = require('express');
const router = express.Router();
const Comic = require('../models/comic');

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
