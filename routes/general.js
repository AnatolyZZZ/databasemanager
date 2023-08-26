import { _getTableNames, _getColumnNames, _getModels, _getVersions } from "../controllers/general.js";
import  express  from "express";

export const generalRouter = express.Router();

generalRouter.get('/tablenames', _getTableNames);
generalRouter.get('/columnnames/:table', _getColumnNames);
generalRouter.get('/models', _getModels);
generalRouter.get('/versions', _getVersions);


