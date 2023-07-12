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
        const query = `
            SELECT attname
            FROM pg_catalog.pg_attribute
            WHERE attrelid = '${tableName}'::regclass
            AND attnum > 0
            AND NOT attisdropped;
        `;
    
        const res =  await db.raw(query);
        // console.log('res =>', res); 
        const columns = res.rows.map(elt => elt.attname)
        
        return columns
    } catch (error) {
        console.log(`error geting column names from table  ${tableName}`, error)
    }
}