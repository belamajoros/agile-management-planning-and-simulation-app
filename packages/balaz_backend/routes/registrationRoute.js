const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');

const router = express.Router();

// const RegistrationService = require('../services/registrationService');

/**
 * @route Post /registration
 * @desc Create new user
 * @param data contain name, email, password, position, avatar
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const data = req.body;
  const { name, email, password, position, avatar } = data;

  if (!(email && password)) {
    return res.status(400).send({ error: 'Data not formatted properly' });
  }

  // creating a new mongoose doc from user data
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password,
    roles: ['user'],
    position,
    avatar,
  });

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt);
  // save user to db
  user
    .save()
    // eslint-disable-next-line prettier/prettier
    .then((doc) => {
      return res.status(201).send({ doc, massage: 'Succesfully registrated!' });
    });
});

module.exports = router;
