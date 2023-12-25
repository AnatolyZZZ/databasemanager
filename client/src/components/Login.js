import { Stack, TextField, Box, Button } from '@mui/material';
import { useState } from 'react';

import api from '../api'

export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { postData, Loading } = api()

    const login = async () => {
        Loading(true);
        const data = await postData('/api/client/login',{ username, password})
        Loading(false);  
    }

    return <>
    <Stack spacing={1}>
    {/* this box is in order to even login and register form height */}
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
    
        {/* this box is in order to even login and register form height */}
        <Box sx={{width: '100%', height : '55px'}}></Box>
        <Box>
            <Box sx={{width: '33%', marginLeft: 'auto', marginRight: 'auto'}}>
                <Button variant='contained'  fullWidth onClick={login}>Login</Button>
            </Box>
        </Box>
    </Stack>
    </>
    
}