import {db} from '../config/db.js'

export const addRows = async (tableName, rows) => {
    try {
        // console.log('adding rows module');
        // console.log(`${tableName} table, and rows are ${rows}`)
        const result = await db(tableName)
        .insert(rows)
        .returning('*')
        // .then(console.log('added'))
        return result
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

export const getTable = async (tableName, model, version) => {
    try {
        let typecast1;
        let typecast2; 
        const _version =`'${version}'`;
        const _model =`'${model}'`
        const constrains = await db(tableName).columnInfo();
        let type = constrains.model?.type;
        if (type === 'character varying' || type === 'text' || type === 'char') {
            typecast1 = "::text";
        } else {
            typecast1 =  "::integer";
        }
        type = constrains.version?.type
        if (type === 'character varying' || type === 'text' || type === 'char') {
            typecast2 = "::text"
        } else typecast2 =  "::integer"
        let query = `SELECT * FROM ${tableName}`
        if (model !== "All models") {
            query += ` WHERE model${typecast1} = ${_model}${typecast1}`
            if (version !== 'All versions') {
                query += ` AND version${typecast2} = ${_version}${typecast2}`
            }
        } else if (version !=="All versions") {
            query += ` WHERE version${typecast2} = ${_version}${typecast2}`
        }
        // console.log(query);
        const table = await db.raw(query);
        // console.log('table',table);
        return table
    } catch (error) {
        console.log(`error geting table ${tableName} from database`, error);
        throw(error)
    }
}