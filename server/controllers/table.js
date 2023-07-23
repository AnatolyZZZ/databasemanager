import { addRows, getTable, updateEntry } from "../modules/table.js";


export const _addRows = async (req, res) => {
    try {
        addRows(req.body.table, req.body.rows);
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error inserting rows ${req.body.rows} into table ${req.body.table}`});
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