// const mongoose = require('mongoose');
// const RegistrationUser = require('../models/registerUser');
// /**
//  * @create create new user
//  * @desc creates new users in db
//  * @access public
//  */
// module.exports.check = async (data) => {
//   const name = data.username;
//   const { password } = data;
//   RegistrationUser.findById(id)
//     .exec()
//     .then((doc) => {
//       console.log(doc);
//       res.status(200).json(doc);
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: err });
//     });
//   return user;
// };
