import { getTableNames, getColumnNames, getTable, updateEntry } from "../modules/general.js";

export const _getTableNames = async (req, res) => {
    try {
        const tableNames = await getTableNames();
        res.status(200).json(tableNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : "error geting tablenames from database"})
    }
}

export const _getColumnNames = async (req, res) => {
    try {
        // console.log('req body',req.body)
        const columnNames = await getColumnNames(req.params.table);
        res.status(200).json(columnNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting column names from table ${req.body.table}`})
    }
}

export const _getTable = async (req, res) => {
    try {
        const table = await getTable(req.params.name);
        res.status(200).json(table)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting table ${req.params.name}`})
    }
}

export const _updateEntry = async (req, res) => {
    // console.log('req.body', req.body)
    try {
        const result = await updateEntry(req.body.tableName, req.body.primaryKey, req.body.keyValue, req.body.entry);
        res.status(200).json(result)
        
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error updating table`, upd : req.body})
    }
}