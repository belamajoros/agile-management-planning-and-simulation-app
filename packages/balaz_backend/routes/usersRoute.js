const express = require('express');

const User = require('../models/user');

const router = express.Router();
/**
 * @route Get users/
 * @desc Route for getting all users without id and password for search purposes
 * @returns Returns all users
 * @acces public
 */
router.get('/', async (req, res, next) => {
  try {
    User.find({}, { /* _id: 0,  */ password: 0 })
      .exec()
      .then((docs) => {
        docs.forEach((u) => {
          return delete u.password;
        });
        if (docs.length >= 0) {
          res.status(200).json(docs);
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });
  } catch (error) {
    next(error);
  }
});

/**
 * @route Get /:userId
 * @desc Route witch return specific user by ID
 * @param userId id of user
 * @acces public
 */
router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    User.find({ _id: userId }, { _id: 0, password: 0 }).then((docs) => {
      if (docs.length > 0) {
        res.status(200).json(docs[0]);
      } else {
        res.status(404).json({
          message: 'No entries found',
        });
      }
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    User.findOneAndDelete({ _id: id })
      .exec()
      .then((record) => {
        if (record) {
          return res
            .status(200)
            .json({ message: 'User deleted successfully!' });
        }
        return res
          .status(404)
          .json({ message: `User with id:${id} does not exist.` });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
