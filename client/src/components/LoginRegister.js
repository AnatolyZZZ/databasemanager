import { Tabs, Tab, Box, Button } from '@mui/material';
import { Login } from './Login'
import { Register } from './Register'

import { useState } from 'react';

export const LoginRegister = (props) => {
    const [selected, select] = useState(0);
    const handleChange = (event, newVal) => {
        select(newVal)
    };

    const actionCallback = (event) => {
        return event
    }

    return <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 600}} mx={5}>
        <Tabs 
            value={selected} 
            onChange={handleChange} 
            aria-label='login register select'
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            >
                <Tab label='Login' id='login'/>
                <Tab label='Register' id='register'/>
        </Tabs>
    </Box>
    <Box sx={{width: 600}} mx={5} my={1}>
        {selected ? <Register/> : <Login/>}
    </Box>
    
    </>
}