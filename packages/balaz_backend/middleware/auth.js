const jwt = require('jsonwebtoken');

/**
 * @create Authentification of users
 * @desc Function is creating token for headers
 */
// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).json({ message: 'Auth Error' });

  try {
    const decoded = jwt.verify(token, 'randomString');
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(500).send({ message: 'Invalid Token' });
  }
};
