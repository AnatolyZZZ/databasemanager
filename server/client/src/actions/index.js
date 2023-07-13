export const ACTIONS = {
    SET_TABLE : 'SET_TABLE',
    SET_COLUMNS : 'SET_COLUMNS'
}

export const setTable = (table) => {
    return {
        type : ACTIONS.SET_TABLE,
        payload : table
    }
}

export const setColumns = (columnNames) => {
    return {
        type : ACTIONS.SET_COLUMNS,
        payload : columnNames
    }
}