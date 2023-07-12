import { _getTableNames, _getColumnNames, _getTable } from "../controllers/general.js";
import  express  from "express";

export const generalRouter = express.Router();

generalRouter.get('/tablenames', _getTableNames);
generalRouter.get('/columnnames', _getColumnNames);
generalRouter.get('/table', _getTable);
