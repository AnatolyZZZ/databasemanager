const  express  = require("express");
const { _chekName } = require("../controllers/client.js");
const clientRouter = express.Router();

clientRouter.post('/check', _chekName);

module.exports = { clientRouter }