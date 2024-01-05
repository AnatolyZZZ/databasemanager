import { store } from '../index'
import { setAlertError, setAlertErrorMessage, setLoading } from '../actions';

export const $alert = (message) => {
    store.dispatch(setAlertErrorMessage(message));
    store.dispatch(setAlertError(true));
}

export const $loading = (val) => {
    store.dispatch(setLoading(val))
}