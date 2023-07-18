import {db} from '../config/db.js'

export const getTableNames = async () => {
    try {
        const res =  await db.raw("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';");
        const names = res.rows.map(elt => elt.tablename)
        // console.log('names =>', names);  
        return names
    } catch (error) {
        console.log('error geting tablenames from database', error)
    }
}

export const getColumnNames = async (tableName) => {
    try {
        const columnQuery = `
            SELECT attname
            FROM pg_catalog.pg_attribute
            WHERE attrelid = '${tableName}'::regclass
            AND attnum > 0
            AND NOT attisdropped;
        `;
        const primaryKeyQuery = `
            SELECT pg_attribute.attname
            FROM pg_index, pg_class, pg_attribute
            WHERE pg_class.oid = '${tableName}'::regclass
            AND indrelid = pg_class.oid
            AND pg_attribute.attrelid = pg_class.oid
            AND pg_attribute.attnum = any(pg_index.indkey)
            AND indisprimary
        `;

        // const getColumInfo = () => db.columnInfo(tableName);
    
        const columnRes =  await db.raw(columnQuery);
        const primaryKeyRes = await db.raw(primaryKeyQuery);
        // console.log('res =>', res); 

        const columns = columnRes.rows.map(elt => elt.attname);

        // const infoPromise = Promise.all(columns.map(elt => getColumInfo(elt)));

        const constrains = await db(tableName).columnInfo()
        // const info = await infoPromise;
        // const constrains = info.map(elt => elt.constrains);
        // console.log('constrains => ', constrains);

        const primaryKey = primaryKeyRes.rows[0].attname;
        // console.log('PK =>', primaryKey); 
        return [columns, primaryKey, constrains]
    } catch (error) {
        console.log(`error geting column names from table  ${tableName}`, error);
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

export const updateEntry = async (tableName, primaryKey, keyValue, entry) => {
    console.log('upd inputs',tableName, primaryKey, keyValue, entry);
    try {
        const result = await db(tableName)
        .where({[primaryKey] : keyValue})
        .update(entry)
        .returning('*')
        console.log('result', result)
        return result
    } catch (error) {
        console.log(`error updating table ${tableName} by entry ${entry}, were ${primaryKey} is ${keyValue}`, error);
        throw(error)
    }
}