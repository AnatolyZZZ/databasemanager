const bcrypt = require('bcrypt');
const { checkName, register } = require('../modules/client');

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
      // eslint-disable-next-line
      console.log('fail', JSON.stringify({ msg: message }), message);
      res.status(500).json({ msg: message });
    } else {
      res.status(200).json({ status, client });
    }
  } catch (error) {
    // eslint-disable-next-line
    console.log('error in user controller', error);
    res.status(500).json({ msg: `error register user ${req.body.username}`, error });
  }
};

module.exports = { chekNameController, registerController };
