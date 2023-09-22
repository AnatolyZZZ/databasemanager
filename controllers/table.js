const { addRows, getTable, updateEntry } = require("../modules/table.js");


const _addRows = async (req, res) => {
    try {
        // console.log('adding rows controller');
        // console.log(`${JSON.stringify(req.body.table)} table, and rows are ${JSON.stringify(req.body.rows)}`)
        const row = await addRows(req.body.table, req.body.rows);
        // console.log(row)
        res.status(200).json(row)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error inserting rows ${JSON.stringify(req.body.rows)} into table ${req.body.table} ${JSON.stringify(error.detail)}`});
    }
}

const _getTable = async (req, res) => {
    try {
        const table = await getTable(req.params.name, req.query.model, req.query.version);
        res.status(200).json(table.rows)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting table ${req.params.name}`})
    }
}

const _updateEntry = async (req, res) => {
    // console.log('req.body', req.body)
    try {
        const result = await updateEntry(req.body.tableName, req.body.primaryKey, req.body.keyValue, req.body.entry);
        res.status(200).json(result)
        
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error updating table`, upd : req.body})
    }
}
module.exports = { _addRows, _getTable, _updateEntry}