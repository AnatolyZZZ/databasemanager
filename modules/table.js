const { db } = require('../config/db');

const addRows = async (tableName, rows) => {
  try {
    const result = await db(tableName)
      .insert(rows)
      .returning('*');
    return result;
  } catch (error) {
    // eslint-disable-next-line
    console.log(`error in module, error adding rows ${JSON.stringify(rows)} to table ${tableName}`, error);
    throw (error);
  }
};

const updateEntry = async (tableName, primaryKey, keyValue, entry) => {
  try {
    const result = await db(tableName)
      .where({ [primaryKey]: keyValue })
      .update(entry)
      .returning('*');
    return result;
  } catch (error) {
    // eslint-disable-next-line
    console.log(`error updating table ${tableName} by entry ${entry}, were ${primaryKey} is ${keyValue}`, error);
    throw (error);
  }
};

const getTable = async (tableName, model, version) => {
  try {
    let typecast1;
    let typecast2;
    const versionText = `'${version}'`;
    const modelText = `'${model}'`;
    const constrains = await db(tableName).columnInfo();
    let type = constrains.model?.type;
    if (type === 'character varying' || type === 'text' || type === 'char') {
      typecast1 = '::text';
    } else {
      typecast1 = '::integer';
    }
    type = constrains.version?.type;
    if (type === 'character varying' || type === 'text' || type === 'char') {
      typecast2 = '::text';
    } else typecast2 = '::integer';
    let query = `SELECT * FROM ${tableName}`;
    if (model !== 'All models') {
      query += ` WHERE model${typecast1} = ${modelText}${typecast1}`;
      if (version !== 'All versions') {
        query += ` AND version${typecast2} = ${versionText}${typecast2}`;
      }
    } else if (version !== 'All versions') {
      query += ` WHERE version${typecast2} = ${versionText}${typecast2}`;
    }
    const table = await db.raw(query);
    return table;
  } catch (error) {
    // eslint-disable-next-line
    console.log(`error geting table ${tableName} from database`, error);
    throw (error);
  }
};

module.exports = { getTable, updateEntry, addRows };
