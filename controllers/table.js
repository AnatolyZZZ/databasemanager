const { addRows, getTable, updateEntry } = require('../modules/table');

const addRowsController = async (req, res) => {
  try {
    const row = await addRows(req.body.table, req.body.rows);
    res.status(200).json(row);
  } catch (error) {
    res.status(409).json({ msg: error?.message });
  }
};

const getTableController = async (req, res) => {
  try {
    const table = await getTable(req.params.name, req.query.model, req.query.version);
    res.status(200).json(table.rows);
  } catch (error) {
    // eslint-disable-next-line
    console.log('error in controller', error);
    res.status(500).json({ msg: `error geting table ${req.params.name}` });
  }
};

const updateEntryController = async (req, res) => {
  const {
    tableName, primaryKey, keyValue, entry,
  } = req.body;
  try {
    const result = await updateEntry(tableName, primaryKey, keyValue, entry);
    res.status(200).json(result);
  } catch (error) {
    // eslint-disable-next-line
    console.log('error in controller', error);
    res.status(409).json({ msg: error.message ? error.message : null, upd: req.body });
  }
};
module.exports = { addRowsController, getTableController, updateEntryController };
