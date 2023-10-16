const { getTableNames, getColumnNames, getModels, getVersions} = require("../modules/general.js");

const _getTableNames = async (req, res) => {
    try {
        const tableNames = await getTableNames();
        res.status(200).json(tableNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : "error geting tablenames from database"})
    }
}

const _getColumnNames = async (req, res) => {
    try {
        // console.log('req body',req.body)
        const columnNames = await getColumnNames(req.params.table);
        res.status(200).json(columnNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting column names from table ${req.body.table}`})
    }
}

const _getModels = async (req, res) => {
    try {
        const models = await getModels(req.query.table);
        res.status(200).json(models.rows);
        
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting models names from table ${req.query.table}`})
    }
}

const _getVersions = async (req, res) => {
    try {
        if (req.query.model !== 'All models') {
            const versions = await getVersions(req.query.table, req.query.model);
            res.status(200).json(versions.rows);
        } else {
            res.status(200).json([])
        } 
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error versions from table ${req.query.table} and model ${req.query.model}`})
    }
}

module.exports = { _getTableNames, _getColumnNames, _getModels, _getVersions}
