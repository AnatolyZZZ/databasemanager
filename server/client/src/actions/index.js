export const ACTIONS = {
    SET_TABLE : 'SET_TABLE',
    SET_COLUMNS : 'SET_COLUMNS',
    SET_LOADING : 'SET_LOADING',
    SET_TABLE_NAME : 'SET_TABLE_NAME',
    GET_TABLES : 'GET_TABLES'
}

export const setTable = (table) => {
    return {
        type : ACTIONS.SET_TABLE,
        payload : table
    }
}

export const setTableName = (name) => {
    return {
        type : ACTIONS.SET_TABLE_NAME,
        payload : name
    }
}

export const setColumns = (columnNames) => {
    return {
        type : ACTIONS.SET_COLUMNS,
        payload : columnNames
    }
}

export const setLoading = (val) => {
    // console.log(`loading is set to ${val} in action`)
    return {
        type : ACTIONS.SET_LOADING,
        payload : val
    }
}

export const setTableNames = (tableNames) => {
    return {
        type : ACTIONS.GET_TABLES,
        payload: tableNames
    }
}