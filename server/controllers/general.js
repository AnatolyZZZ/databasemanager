import { getTableNames, getColumnNames, getModels, getVersions} from "../modules/general.js";

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

export const _getModels = async (req, res) => {
    try {
        const models = await getModels(req.query.table);
        res.status(200).json(models.rows);
        
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error geting models names from table ${req.query.table}`})
    }
}

export const _getVersions = async (req, res) => {
    try {
        const models = await getVersions(req.query.table, req.query.model);
        res.status(200).json(models.rows);
        
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : `error versions from table ${req.query.table} and model ${req.query.model}`})
    }
}
