const  express  = require("express");
const { _chekName, _register } = require("../controllers/client.js");
const clientRouter = express.Router();

clientRouter.post('/check', _chekName);
clientRouter.post('/register', _register);

module.exports = { clientRouter }