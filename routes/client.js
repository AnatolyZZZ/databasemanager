const express = require('express');
const { chekNameController, registerController, loginController } = require('../controllers/client');

const clientRouter = express.Router();

clientRouter.post('/check', chekNameController);
clientRouter.post('/register', registerController);
clientRouter.post('/login', loginController);

module.exports = { clientRouter };
