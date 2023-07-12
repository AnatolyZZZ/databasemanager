import { getTableNames, getColumnNames, getTable } from "../modules/general.js";

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
        const columnNames = await getColumnNames(req.body.table);
        res.status(200).json(columnNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting column names from table ${req.body.table}`})
    }
}

export const _getTable = async (req, res) => {
    try {
        // console.log('req body',req.body)
        const table = await getTable(req.body.table);
        res.status(200).json(table)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting  table ${req.body.table}`})
    }
}