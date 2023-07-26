import { addRows, getTable, updateEntry } from "../modules/table.js";


export const _addRows = async (req, res) => {
    try {
        // console.log('adding rows controller');
        // console.log(`${JSON.stringify(req.body.table)} table, and rows are ${JSON.stringify(req.body.rows)}`)
        const row = await addRows(req.body.table, req.body.rows);
        console.log(row)
        res.status(200).json(row)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error inserting rows ${JSON.stringify(req.body.rows)} into table ${req.body.table}`});
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