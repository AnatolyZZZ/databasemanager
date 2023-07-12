import express  from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import { generalRouter } from './routes/general.js'
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const server = express();
server.use(cors());
server.use(express.urlencoded({extended:true}));
server.use(express.json())

server.use('/api/general', generalRouter)

server.listen(process.env.PORT, ()=>{
    console.log(`run on port ${process.env.PORT}`);
  })