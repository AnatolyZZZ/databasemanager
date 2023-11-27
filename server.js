const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser';
const path = require('path');
const { generalRouter } = require('./routes/general');
const { tableRouter } = require('./routes/table');
const { clientRouter } = require('./routes/client');

dotenv.config();

const server = express();
server.use(cors());
// server.use(express.urlencoded({extended:true}));
// server.use(express.json())
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

server.use('/api/general', generalRouter);
server.use('/api/table', tableRouter);
server.use('/api/client', clientRouter);

server.use(express.static(path.resolve(__dirname, './client/build')));
server.use(express.static(path.join(__dirname, 'client/build')));

server.listen(process.env.PORT || 5002, () => {
  // eslint-disable-next-line
  console.log(`run on port ${process.env.PORT || 5002}`);
});
