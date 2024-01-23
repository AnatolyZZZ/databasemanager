import { store } from '../index'
import { setAlertError, setAlertErrorMessage, ACTIONS } from '../actions';

export const $alert = (message) => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    store.dispatch(setAlertErrorMessage(message));
    store.dispatch(setAlertError(true));
}

export const $loading = (val) => {
    store.dispatch({type : ACTIONS.SET_LOADING, payload: val})
}

export const $navigate = (route) => {
    store.dispatch({type : ACTIONS.NAVIGATE, payload: route})
}

export const $delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms)
})