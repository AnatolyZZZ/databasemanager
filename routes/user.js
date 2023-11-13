const  express  = require("express");
const { _chekName } = require("../controllers/user.js");
const userRouter = express.Router();

userRouter.post('/check', _chekName);

module.exports = { userRouter }