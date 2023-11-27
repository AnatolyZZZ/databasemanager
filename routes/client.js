const express = require('express');
const { chekNameController, registerController } = require('../controllers/client');

const clientRouter = express.Router();

clientRouter.post('/check', chekNameController);
clientRouter.post('/register', registerController);

module.exports = { clientRouter };
