const express = require('express');
const { verifyToken } = require('../middleware/verifyToken');
const { updateToken } = require('../middleware/updateToken');
const { getTableController, updateEntryController, addRowsController } = require('../controllers/table');

const tableRouter = express.Router();

tableRouter.get('/:name', getTableController);
tableRouter.put('/', updateToken, updateEntryController);
tableRouter.post('/', verifyToken, updateToken, addRowsController);

module.exports = { tableRouter };
