const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  password: String,
  roles: Array,
  position: String,
  avatar: String,
});

module.exports = mongoose.model('users', userSchema);
