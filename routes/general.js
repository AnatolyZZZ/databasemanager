const express = require('express');
const {
  getTableNamesController, getColumnNamesController, getModelsController, getVersionsController,
} = require('../controllers/general');

const generalRouter = express.Router();

generalRouter.get('/tablenames', getTableNamesController);
generalRouter.get('/columnnames/:table', getColumnNamesController);
generalRouter.get('/models', getModelsController);
generalRouter.get('/versions', getVersionsController);

module.exports = { generalRouter };
