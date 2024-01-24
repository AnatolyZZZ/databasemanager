const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getUser } = require('../modules/client');

dotenv.config();

const verifyToken = (req, res, next) => {
  const accessTokenKrya = req.cookies?.accessTokenKrya || req.headers['x-access-token'];

  if (!accessTokenKrya) {
    res.setHeader('isAuth', 'false');
    return res.status(401).json({ msg: 'Permision denied! Login to perform action' });
  }

  const decodeFunc = async (err, decoded) => {
    if (err) {
      res.setHeader('isAuth', 'false');
      return res.status(403).json({ msg: 'verify token fail!' });
    }

    req.username = decoded?.username;

    try {
      const user = await getUser(decoded?.username);

      if (!user) {
        res.setHeader('isAuth', 'false');
        res.status(403).json({ msg: 'veryfy user fail!' });
      }

      next();
    } catch (error) {
      res.setHeader('isAuth', 'false');
      res.status(403).json({ msg: 'verify user fail!' });
    }
  };

  jwt.verify(accessTokenKrya, process.env.ACCESS_TOKEN_SECRET, decodeFunc);
};

module.exports = { verifyToken };
