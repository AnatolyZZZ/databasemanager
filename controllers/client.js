const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { checkName, register, getUser } = require('../modules/client');
// const dotenv = require('dotenv');

const chekNameController = async (req, res) => {
  try {
    const dbRes = await checkName(req.body.username);
    res.status(200).json({ exist: dbRes });
  } catch (error) {
    // eslint-disable-next-line
    console.log('error in user controller', error);
    res.status(500).json({ msg: `error checking user ${(req.body.username)}`, error });
  }
};

const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const { status, message, client } = await register(username, hashPassword);
    if (status === 'fail') {
      res.status(500).json({ msg: message });
    } else {
      const accessTokenKrya = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
      res.cookie('accessTokenKrya', accessTokenKrya, {
        httpOnly: true,
        maxAge: 600 * 1000,
      });
      res.status(200).json({ status, client });
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log('error in user controller', error);
    res.status(500).json({ msg: `error register user ${req.body.username}`, error });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUser(username);
    if (!user || (Array.isArray(user) && user.length === 0)) return res.status(403).json({ msg: 'no such user' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) res.status(400).json({ msg: 'Invalid password' });
    const accessTokenKrya = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
    res.cookie('accessTokenKrya', accessTokenKrya, {
      httpOnly: true,
      maxAge: 600 * 1000,
    });
    res.json({isAuth: true})
    // res.json({ accessTokenKrya });
  } catch (error) {
    // eslint-disable-next-line
    console.log('error ->',error);
  }
};

module.exports = { chekNameController, registerController, loginController };
