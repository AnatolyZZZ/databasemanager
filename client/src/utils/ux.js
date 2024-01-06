import { store } from '../index'
import { setAlertError, setAlertErrorMessage, ACTIONS } from '../actions';

export const $alert = (message) => {
    store.dispatch(setAlertErrorMessage(message));
    store.dispatch(setAlertError(true));
}

export const $loading = (val) => {
    store.dispatch({type : ACTIONS.SET_LOADING, payload: val})
}