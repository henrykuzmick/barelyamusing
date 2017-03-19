const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const comicSchema = Schema({
  title: String,
  tags: [String],
  url: String,
  comment: String,
  favorite: Boolean,
  fb: String,
  long: String,
  main: String,
  thumb: String
});

const Comic = mongoose.model('Comic', comicSchema);

module.exports = Comic;

module.exports.addComic = function(comic, callback)  {
  Comic.create(comic, callback);
}

module.exports.getComics = function(callback, limit) {
  Comic.find(callback).limit(limit).sort({_id: 1})
}

module.exports.getRandom = () => {
  return Comic.count({}).then((i) => {
    const skip = Math.floor(Math.random()*i);
    return Comic.find({}).skip(skip).limit(1);
  });
}

module.exports.getLatest = () => {
  return Comic.find({}).sort({_id: -1 }).limit(1);
}

module.exports.getComic = (url) => {
  return Comic.findOne({url: url});
}

module.exports.getNext = (id) => {
  return Comic.findOne({_id: {$gt: id}}).sort({_id: 1 });
}

module.exports.getPrev = (id) => {
  return Comic.findOne({_id: {$lt: id}}).sort({_id: -1 });
}


//
// module.exports.addCategory = function(category, callback)  {
//   Category.create(category, callback);
// }
//
// module.exports.getCategoryById = function(id, callback) {
//   Category.findById(id, callback);
// }
//
// module.exports.updateCategory = function(id, update, options, callback){
//   Category.findOneAndUpdate({_id: id}, update, options, callback);
// }
//
// module.exports.removeCategory = function(id, callback) {
//   Category.remove({_id: id}, callback);
// }
