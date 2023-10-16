const  express  = require("express");
const { _getTable, _updateEntry, _addRows } = require("../controllers/table.js");
const tableRouter = express.Router();

tableRouter.get('/:name', _getTable);
tableRouter.put('/', _updateEntry);
tableRouter.post('/', _addRows);

module.exports = { tableRouter }