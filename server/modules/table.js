import {db} from '../config/db.js'

export const addRows = async (tableName, rows) => {
    try {
        // console.log('adding rows module');
        // console.log(`${tableName} table, and rows are ${rows}`)
        db(tableName)
        .insert(rows)
        .returning('*')
        // .then(console.log('added'))
    } catch (error) {
        console.log(`error in module, error adding rows ${JSON.stringify(rows)} to table ${tableName}`, error);
        throw(error)
    }
}

export const updateEntry = async (tableName, primaryKey, keyValue, entry) => {
    // console.log('upd inputs',tableName, primaryKey, keyValue, entry);
    try {
        const result = await db(tableName)
        .where({[primaryKey] : keyValue})
        .update(entry)
        .returning('*')
        // console.log('result', result)
        return result
    } catch (error) {
        console.log(`error updating table ${tableName} by entry ${entry}, were ${primaryKey} is ${keyValue}`, error);
        throw(error)
    }
}

export const getTable = async (tableName) => {
    try {
        const table = await db(tableName)
        .select('*')
        return table
    } catch (error) {
        console.log(`error geting table ${tableName} from database`, error);
        throw(error)
    }
}