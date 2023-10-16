const { _getTableNames, _getColumnNames, _getModels, _getVersions } = require("../controllers/general.js");
const  express  = require("express");

const generalRouter = express.Router();

generalRouter.get('/tablenames', _getTableNames);
generalRouter.get('/columnnames/:table', _getColumnNames);
generalRouter.get('/models', _getModels);
generalRouter.get('/versions', _getVersions);

module.exports = { generalRouter }
