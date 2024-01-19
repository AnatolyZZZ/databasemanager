import { Stack, TextField, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { setAuth } from '../actions';
import { postData } from '../utils/api';
import { $loading } from '../utils/ux';

export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isAuth = useSelector((state) => state.isAuth)
    const dispatch = useDispatch();

    const login = async () => {
        $loading(true);
        const { isAuth } = await postData('/api/client/login',{ username, password});
        if (isAuth) dispatch(setAuth(true));
        $loading(false);  
    }

    return !isAuth ? <>
    <Stack spacing={1}>
        
        {/* this box is in order to even login and register forms height */}
        <Box sx={{width: '100%', height : '1px'}}></Box>

        <TextField 
            id="username" 
            label="Username" 
            variant="outlined" 
            onChange={ (event) => { setUsername(event.target.value) } }
        />
        
        <TextField 
            id="password" 
            label="Password" 
            variant="outlined" 
            type="password"
            onChange={ (event) => { setPassword(event.target.value) } }
        />
        
        {/* this box is in order to even login and register forms height */}
        <Box sx={{width: '100%', height : '55px'}}></Box>

        <Box>
            <Box sx={{width: '33%', marginLeft: 'auto', marginRight: 'auto'}}>
                <Button variant='contained'  fullWidth onClick={login}>Login</Button>
            </Box>
        </Box>

    </Stack>
    </> : <>
        <Button variant='contained' color='warning' fullWidth onClick={() => dispatch(setAuth(false))}> Exit</Button>
    </>
    
}