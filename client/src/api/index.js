import { useDispatch, useSelector } from 'react-redux';
import {  setAlertError, setAlertErrorMessage, setLoading } from '../actions';

function api() {
    const dispatch = useDispatch();
    const root_url = useSelector((state) => state.root_url);

    const Alert = (message) => {
        console.log('Alert called with message', message);
        dispatch(setAlertErrorMessage(message));
        dispatch(setAlertError(true))
    }

    const getData = async (route, para = {}, abort=null, errorMessage='Failed to fetch data', unsuccedMessage=null) => {
        let optionsString = ''
        Object.entries(para).forEach(([key, value]) => optionsString+=`${key}=${value}&`);
        if (optionsString) optionsString = '?' + optionsString.slice(0, -1);
        try {
            const response = await fetch(`${root_url}${route}${optionsString}`, {signal: abort});
            const data = await response.json()
            if (response.status === 200) {
                return data
            } else {
                const message = unsuccedMessage ? unsuccedMessage : data.msg;
                Alert(message)
            }
            
        } catch (error) {
            Alert(errorMessage)
        }   
    }

    const postData = async (route, payload, para = {}, abort = null, errorMessage='Failed to post data', unsuccedMessage=null) => {
        let optionsString = ''
        Object.entries(para).forEach(([key, value]) => optionsString+=`${key}=${value}&`);
        if (optionsString) optionsString = '?' + optionsString.slice(0, -1);
        const requestParams = {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(payload),
            signal: abort
        }
        try {
            console.log('`${root_url}${route}${optionsString}` ->',`${root_url}${route}${optionsString}`);
            const response = await fetch(`${root_url}${route}${optionsString}`, requestParams);
            const data = await response.json()
            if (response.status === 200) {
                return data
            } else {
                const message = unsuccedMessage ? unsuccedMessage : data.msg;
                Alert(message)
            }
            
        } catch (error) {
            Alert(errorMessage)
        } 
    }
    const Loading = async (val) => {
        dispatch(setLoading(val))
    } 
    return { Alert, getData, postData, Loading }
}

export default api