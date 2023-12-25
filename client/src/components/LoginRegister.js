import { Tabs, Tab, Box, Stack} from '@mui/material';
import { Login } from './Login'
import { Register } from './Register'
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MyAlert } from './MyAlert';

import { useState } from 'react';

export const LoginRegister = (props) => {
    const [selected, select] = useState(0);
    const handleChange = (event, newVal) => {
        select(newVal)
    };
    const navigate = useNavigate();

    return <>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: 600}} mx={5}>
        <Stack direction="row" spacing={1} useFlexGap alignItems="center" style={{cursor: 'pointer'}} onClick={()=>navigate('/')}>
            <ArrowBack color='secondary'/>
            <Box style={{color: '#9c27b0'}}>Back</Box>
        </Stack>
        <MyAlert customMarginBottom="0"/>
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