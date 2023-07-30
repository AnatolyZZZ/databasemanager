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
    
        const columnRes =  await db.raw(columnQuery);
        const primaryKeyRes = await db.raw(primaryKeyQuery);


        const columns = columnRes.rows.map(elt => elt.attname);

        const constrains = await db(tableName).columnInfo()

        const primaryKey = primaryKeyRes.rows[0].attname;
      
        return [columns, primaryKey, constrains]
    } catch (error) {
        console.log(`error geting column names from table  ${tableName}`, error);
        throw(error)
    }
}

export const getModels = async (tableName) => {
    try {
        const modelQuery = `SELECT DISTINCT model FROM ${tableName}`;
        return await db.raw(modelQuery)
        
    } catch (error) {
        console.log(`error geting models from table  ${tableName}`, error);
        throw(error)
    }
}

export const getVersions = async (tableName, model) => {
    try {
        const versionsQuery = `SELECT DISTINCT version FROM ${tableName}
        WHERE model='${model}'`;
        return await db.raw(versionsQuery)
        
    } catch (error) {
        console.log(`error geting models from table  ${tableName} for model${model}`, error);
        throw(error)
    }
}



