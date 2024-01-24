const jwt = require('jsonwebtoken');
const { getUser } = require('../modules/client');

const updateToken = (req, res, next) => {
  const accessTokenKrya = req.cookies?.accessTokenKrya || req.headers['x-access-token'];
  if (!accessTokenKrya) {
    res.setHeader('isAuth', 'false');
    return next();
  }

  const decodeFunc = async (err, decoded) => {
    if (err) {
      res.setHeader('isAuth', 'false');
      return next();
    }

    try {
      const username = decoded?.username;
      if (!username) {
        res.setHeader('isAuth', 'false');
        return next();
      }
      const user = await getUser(username);
      if (!user) {
        res.setHeader('isAuth', 'false');
        return next();
      }
      const newToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
      res.cookie('accessTokenKrya', newToken, {
        httpOnly: true,
        maxAge: 600 * 1000,
      });
      res.setHeader('isAuth', 'true');
      return next();
    } catch (error) {
      res.setHeader('isAuth', 'false');
      return next();
    }
  };

  jwt.verify(accessTokenKrya, process.env.ACCESS_TOKEN_SECRET, decodeFunc);
};

module.exports = { updateToken };
