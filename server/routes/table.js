import  express  from "express";
import { _getTable, _updateEntry, _addRows } from "../controllers/table.js";
export const tableRouter = express.Router();

tableRouter.get('/:name', _getTable);
tableRouter.put('/', _updateEntry);
tableRouter.post('/', _addRows);