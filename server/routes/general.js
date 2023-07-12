import { _getTableNames } from "../controllers/general.js";
import  express  from "express";

export const generalRouter = express.Router();

generalRouter.get('/tablenames', _getTableNames);
