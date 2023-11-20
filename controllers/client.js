const { checkName, register } = require("../modules/client.js");
const bcrypt = require('bcrypt');

const _chekName = async (req, res) => {
    try {
        const db_res = await checkName(req.body.username);
        res.status(200).json({exist : db_res})
    } catch (error) {
        console.log('error in user controller', error);
        res.status(500).json({msg : `error checking user ${(req.body.username)}`, error : error});
    }
}

const _register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const { status, message, client } = await register(username, hashPassword);
        if (status === 'fail') {
            console.log('fail', JSON.stringify({msg : message}), message)
            res.status(500).json({msg : message})
        } else {
            res.status(200).json({status, client})
        }
    } catch (error) {
        console.log('error in user controller', error);
        res.status(500).json({msg : `error register user ${req.body.username}`, error : error});
    }
}

module.exports = { _chekName, _register }