import { ACTIONS } from "../actions"

const initialState = {
    table : [],
    loading : false,
    columns : []
}

export const reducer = (state = initialState, action = {}) => {
    switch(action.type) {
        case (ACTIONS.SET_TABLE) :
            return {...state, table : action.payload}
        case (ACTIONS.SET_COLUMNS) :
            return {...state, columns : action.payload}
        default :
            return {...state}
    }
}