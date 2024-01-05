import { store } from '../index';
import { $alert } from './ux';

export const getData =  async (route, para = {}, abort=null, errorMessage='Failed to fetch data', unsuccedMessage=null) => {
        const root_url = store.getState().root_url;
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
                $alert(message)
            }
            
        } catch (error) {
            $alert(errorMessage)
        }   
    }

 export const postData = async (route, payload, para = {}, abort = null, errorMessage='Failed to post data', unsuccedMessage=null) => {
        const root_url = store.getState().root_url;
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
            const response = await fetch(`${root_url}${route}${optionsString}`, requestParams);
            const data = await response.json()
            if (response.status === 200) {
                return data
            } else {
                const message = unsuccedMessage ? unsuccedMessage : data.msg;
                $alert(message)
            }
            
        } catch (error) {
            $alert(errorMessage)
        } 
    }