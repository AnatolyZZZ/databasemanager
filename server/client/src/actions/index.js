export const ACTIONS = {
    SET_TABLE : 'SET_TABLE',
    SET_COLUMNS : 'SET_COLUMNS',
    SET_LOADING : 'SET_LOADING',
    SET_TABLE_NAME : 'SET_TABLE_NAME',
    GET_TABLES : 'GET_TABLES',
    TOGGLE_SELECTED : 'TOGGLE_SELECTED',
    SET_SELECTED : 'SET_SELECTED',
    SET_PK : 'SET_PK',
    EDIT_MODE : 'EDIT_MODE',
    SET_EDIT_ERROR_MESSAGES : 'SET_ERROR_MESSAGE',
    SET_ALERT_ERROR : 'SET_ALERT_ERROR',
    SET_ALERT_ERROR_MESSAGE : 'SET_ALERT_ERROR_MESSAGE',
    OPEN_NEW_ROW : 'OPEN_NEW_ROW'
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
        payload : tableNames
    }
}

export const toggleSelected = (id) => {
    return {
        type : ACTIONS.TOGGLE_SELECTED,
        payload : id 
    }
}

export const setSelected = (newSelected) => {
    return {
        type : ACTIONS.SET_SELECTED,
        payload : newSelected
    }
}

export const setPrimaryKey = (key) => {
    return {
        type : ACTIONS.SET_PK,
        payload : key
    }
}

export const setEditMode = (val) => {
    return {
        type : ACTIONS.EDIT_MODE,
        payload : val
    }
}

export const setAlertError = (val) => {
    return {
        type : ACTIONS.SET_ALERT_ERROR,
        payload : val
    }
}

export const setAlertErrorMessage = (val) => {
    return {
        type : ACTIONS.SET_ALERT_ERROR_MESSAGE,
        payload : val
    }
}

export const openNewRow = (val) => {
    return {
        type : ACTIONS.OPEN_NEW_ROW,
        payload : val
    }
}

