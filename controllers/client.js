const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const { checkName, register, getUser } = require('../modules/client');
// const dotenv = require('dotenv');

const sendTelegramTelemetry = async (message) => {
  const msgObj = {
    chat_id: Number(process.env.TELEGRAM_CHAT),
    text: message,
  };

  const para = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msgObj),
  };
  try {
    const res = await fetch(`https://api.telegram.org/${process.env.TELEGRAM_BOT}:${process.env.TELEGRAM_PASS}`, para);
    if (!res.status === 200) throw new Error(`${res.status} ${res.statusText}`);
  } catch (error) {
    // eslint-disable-next-line
    console.log('error sending telegram->', error);
    return false;
  }
  return true;
};

const constructMessage = (client) => {
  const expVocabulary = {
    jun: 'Junior',
    mid: 'Middle',
    senior: 'Senior',
    other: 'Unknown',
  };
  const positionVocabulary = {
    front: 'Front-end',
    back: 'Back-end',
    full: 'Fullstack',
    other: 'gneral IT specialist',
  };
  const {
    username, companyname, position, experience, additionalinfo,
  } = client;
  return `REGISTRATION ALERT
  ${username} from ${companyname} is looking for 
  ${expVocabulary[experience]} level ${positionVocabulary[position]}
  ${additionalinfo}`;
};

const postToTelegram = async (req, res) => {
  const referer = req.get('Referer');
  if (!(referer === 'https://anatolyzzz.github.io/portfolio/' || referer === 'http://localhost:3001/' || referer === 'http://localhost:3000/')) res.status(401).json({ msg: 'failed to post to telegram' });
  else {
    const { text } = req.body;
    const result = await sendTelegramTelemetry(text);
    if (result) res.status(200).json({ msg: 'ok' });
  }
};

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
    const {
      username, password, position, companyName, experience, additionalInfo,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const { status, message, client } = await register(username, hashPassword, position, companyName, experience, additionalInfo);
    if (status === 'fail') {
      res.status(500).json({ msg: message });
    } else {
      const accessTokenKrya = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
      res.cookie('accessTokenKrya', accessTokenKrya, {
        httpOnly: true,
        maxAge: 600 * 1000,
      });
      sendTelegramTelemetry(constructMessage(client));
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
    res.json({ isAuth: true });
    // res.json({ accessTokenKrya });
  } catch (error) {
    // eslint-disable-next-line
    console.log('error ->',error);
  }
};

module.exports = {
  chekNameController, registerController, loginController, postToTelegram,
};
