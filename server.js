import express  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  bodyParser  from 'body-parser';
// import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import { generalRouter } from './routes/general.js';
import { tableRouter } from './routes/table.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const server = express();
server.use(cors());
// server.use(express.urlencoded({extended:true}));
// server.use(express.json())
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



server.use('/api/general', generalRouter);
server.use('/api/table', tableRouter);

server.use(express.static(path.resolve(__dirname, "./client/build")));
server.use(express.static(path.join(__dirname, "client/build")));

server.listen(process.env.PORT || 5002, ()=>{
    console.log(`run on port ${process.env.PORT || 5002}`);
  })