import { Stack, TextField, Button, Box, Collapse} from '@mui/material';
import MUIAlert from '@mui/material/Alert'
import api from '../api';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAlertError } from '../actions'


export const Register = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [successAlert, openSuccess] = useState(false);
    const dispatch = useDispatch();
    const { Alert, postData } = api();

    const validate = () => {
        if (password !== passwordConfirm) {
            Alert('Passwords do not match ');
            return  false
        }
        return true
    }

    const checkName = async () => {
        const data = await postData('/api/client/check', { username });
        if (data?.exist) {
            Alert(`User ${username} already exists`);
            return  false
        }
        return true
    }

    const validateAndRegister = async () => {
        let valid = validate()
        if (!valid) return
        valid = await checkName()
        if (!valid) return
        const data = await postData('/api/client/register', { password, username })
        if (data?.status === 'ok') openSuccess(true);
        
    }

    return <Stack spacing={1} >
        <Collapse in={successAlert}>
            <MUIAlert severity="success" onClick={() => openSuccess(false)}>User registered!</MUIAlert>
        </Collapse>
        
        <TextField 
            id="username" 
            label="Username" 
            variant="outlined"
            onChange={ (event) => {
                setUsername(event.target.value)
                dispatch(setAlertError(false))
                }  
            }
            onBlur={ checkName }
            />
        <TextField 
            id="password" 
            label="Password" 
            variant="outlined" 
            onChange={ (event) => setPassword(event.target.value)} 
            />
        <TextField 
            id="confirm_password" 
            label="Confirm password" 
            variant="outlined"
            onChange={ (event) => {
                    setPasswordConfirm(event.target.value)
                    dispatch(setAlertError(false))
                }
            }  
            onBlur={ validate }
            />
        <Box><Box 
                sx={{width: '33%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Button variant='contained' color='warning' fullWidth onClick={validateAndRegister}>Register</Button>
        </Box></Box>
        
    </Stack>
}