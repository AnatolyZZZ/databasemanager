const express = require('express');
const { chekNameController, registerController, loginController, postToTelegram } = require('../controllers/client');

const clientRouter = express.Router();

clientRouter.post('/check', chekNameController);
clientRouter.post('/register', registerController);
clientRouter.post('/login', loginController);
clientRouter.post('/telegram', postToTelegram);

module.exports = { clientRouter };
