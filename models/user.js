const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;

module.exports.signupUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) {
        console.log(err)
      }
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}

module.exports.getUserByEmail = function(email, callback) {
  User.findOne({email}, callback);
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  })
}
