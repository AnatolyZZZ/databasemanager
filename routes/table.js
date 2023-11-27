const express = require('express');
const { getTableController, updateEntryController, addRowsController } = require('../controllers/table');

const tableRouter = express.Router();

tableRouter.get('/:name', getTableController);
tableRouter.put('/', updateEntryController);
tableRouter.post('/', addRowsController);

module.exports = { tableRouter };
