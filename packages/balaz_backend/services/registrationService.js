const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * @create Registration
 * @desc creates new record in dokument users in database
 * @param {Object} data contain name, email and password
 * @return {String} Object contain of new created User
 */
module.exports.create = async (data) => {
  const name = data.username;
  const { email } = data;
  const { password } = data;

  const newUser = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password,
  });
  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  newUser.password = await bcrypt.hash(newUser.password, salt);

  newUser
    .save()
    .then((res) => {
      res.json();
    })
    .catch((err) => {
      throw Error(err);
    });

  return newUser;
};
