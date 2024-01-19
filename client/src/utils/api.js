import { store } from '../index';
import { $alert, $delay } from './ux';
import { myNavigate, setAuth } from '../actions';

export const getData =  async (route, para = {}, abortController={signal : null}, errorMessage='Failed to fetch data', unsuccedMessage=null) => {
        const requestParams = {
            method: 'GET',
            credentials: 'include',
            signal: abortController.signal
        }
        try {
            const response = await makeFetch(route, para, requestParams)
            const data = await response.json()
            if (response.status === 200) {
                return data
            } else {
                const message = unsuccedMessage ? unsuccedMessage : data.msg;
                $alert(message)
            }
            
        } catch (error) {
            if (!abortController?.signal?.aborted) $alert(errorMessage)
        }   
    }

 export const postData = async (route, payload, para = {}, abortController = {signal : null}, errorMessage='Failed to post data', unsuccedMessage=null, put=false) => {
        const requestParams = {
            method: put ? 'PUT' : 'POST',
            headers: { 'Content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(payload),
            signal: abortController.signal
        }
        try {
            const response = await makeFetch(route, para, requestParams);
            const isAuth = response.headers.get('isAuth');
            console.log('isAuth ->',isAuth);
            if (isAuth === false || isAuth === 'false') store.dispatch(setAuth(false));
            const data = await response.json()
            if (response.status === 200)  return data
            const message = unsuccedMessage ? unsuccedMessage : data.msg;
            $alert(message)
            if (response.status === 401) {
                await $delay(500)
                store.dispatch(setAuth(false))
                store.dispatch(myNavigate('/loginregister'))
            }
            
        } catch (error) {
            $alert(errorMessage)
        } 
    }

    const makeFetch = async (route, para, requestParams) => {
        const root_url = store.getState().root_url;
        let optionsString = ''
        Object.entries(para).forEach(([key, value]) => optionsString+=`${key}=${value}&`);
        if (optionsString) optionsString = '?' + optionsString.slice(0, -1);
        return fetch(`${root_url}${route}${optionsString}`, requestParams);
    }