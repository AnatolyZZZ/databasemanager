import { ACTIONS } from "../actions"

const initialState = {
    table_name : '',
    table : [],
    loading : false,
    columns : [],
    root_url : 'http://localhost:5002',
    tables : []
}

export const reducer = (state = initialState, action = {}) => {
    switch(action.type) {
        case (ACTIONS.SET_TABLE) :
            return {...state, table : action.payload}
        case (ACTIONS.SET_COLUMNS) :
            return {...state, columns : action.payload}
        case (ACTIONS.SET_LOADING) :
            return {...state, loading : action.payload}
        case (ACTIONS.SET_TABLE_NAME) :
            return {...state, table_name : action.payload}
        case (ACTIONS.GET_TABLES) :
            return {...state, tables : action.payload}
        default :
            return {...state}
    }
}