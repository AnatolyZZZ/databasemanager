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
    const getEnum = async (columnName) => {
        const query = `
        SELECT DISTINCT enumlabel FROM pg_enum
        WHERE enumtypid = (SELECT oid FROM pg_type
                          WHERE typname = (SELECT udt_name FROM information_schema.columns
                                           WHERE table_name = '${tableName}'
                                           AND column_name = '${columnName}'))
        `
        try {
           return db.raw(query);
        } catch {
            return null;
        }
    }


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

        let constrains = await db(tableName).columnInfo();

        const editConstrains = async (constrains) => {
            const promiseArr = [];
            const new_constrains = {...constrains}
            
            Object.entries(constrains).forEach( ([columnName, constrain]) => {
            if (constrain.type === 'USER-DEFINED') {
                
                const enumVal = getEnum(columnName);
                promiseArr.push(enumVal);
                enumVal.then(
                    res => {
                        if (res) {
                            // console.log('in if', res)
                            new_constrains[columnName].type = 'enum';
                            new_constrains[columnName]['enumValues'] = res.rows.map(elt => elt.enumlabel);
                        }
                     })
                }
            })

            const resp = Promise.all(promiseArr);
            const result = new Promise ((resolve, reject) => {
                resp.then( res => 
                    resolve(new_constrains)
                )
            })
            return result
        }
        if (Object.values(constrains).some(elt => elt.type === 'USER-DEFINED')) {
            constrains = await editConstrains(constrains);
        }

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
        const constrains = await db(tableName).columnInfo();
        const type = constrains.model?.type;
        let _model;
        let typecast;
        if (type === 'character varying' || type === 'text' || type ==='char') {
            _model = `'${model}'`
            typecast = '::text'
        }
        let query = `SELECT DISTINCT version FROM ${tableName}`
        if (model !== 'All models') {
            query += ` WHERE model${typecast} = ${_model}${typecast}`
        };
        const versions = await db.raw(query)
        // console.log('query', query);       
        // console.log('versions', versions);
        return versions
    } catch (error) {
        console.log(`error geting models from table  ${tableName} for model ${model}`, error);
        throw(error)
    }
}



