import { ACTIONS } from "../actions"

const initialState = {
    table_name : '',
    table : [],
    loading : false,
    columns : [],
    root_url : 'http://localhost:5002',
    tables : [],
    selected_columns : [],
    primaryKey : '',
    editing : false,
    edit_correct : true
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
        case (ACTIONS.SET_SELECTED) :
            localStorage.setItem(`${state.table_name}_selected`, JSON.stringify(action.payload));
            return {...state, selected_columns : action.payload}
        case (ACTIONS.TOGGLE_SELECTED) :
            // in selected columns we have values of  {name: _name, selected : true}
            const new_selected = [...state.selected_columns]
            new_selected[action.payload][1] = !state.selected_columns[action.payload][1];
            const returnValue = {...state, selected_columns:new_selected}
            localStorage.setItem(`${state.table_name}_selected`, JSON.stringify(new_selected));
            return returnValue
        case (ACTIONS.SET_PK) :
            return {...state, primaryKey : action.payload}
        case (ACTIONS.EDIT_MODE) :
            return {...state, editing : action.payload}
        case (ACTIONS.SET_EDIT_CORRECT) :
            return {...state, edit_correct : action.payload}
        default :
            return {...state}
    }
}