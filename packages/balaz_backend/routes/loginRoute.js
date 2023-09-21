const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

/**
 * @route Post login/
 * @desc Route for logging in users
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/', async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Incorrect Password !',
      });
    }

    const payload = {
      user,
    };

    jwt.sign(
      payload,
      'randomString',
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          user,
          token,
        });
      }
    );
  } catch (e) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
});

module.exports = router;
