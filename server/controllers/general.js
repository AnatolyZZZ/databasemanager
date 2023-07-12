import { getTableNames } from "../modules/general.js";

export const _getTableNames = async (req, res) => {
    try {
        const tableNames = await getTableNames();
        res.status(200).json(tableNames)
    } catch (error) {
        console.log('error in controller', error);
        res.status(500).json({msg : "error geting tablenames from database"})
    }
}