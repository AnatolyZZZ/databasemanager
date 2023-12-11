import { Stack, TextField, Button, Box} from '@mui/material';

export const Register = (props) => {
    return <Stack spacing={1} >
        <TextField id="username" label="Username" variant="outlined" />
        <TextField id="password" label="Password" variant="outlined" />
        <TextField id="confirm_password" label="Confirm password" variant="outlined" />
        <Box><Box sx={{width: '33%', marginLeft: 'auto', marginRight: 'auto'}}><Button variant='contained' color='warning' fullWidth>Register</Button></Box></Box>
        
    </Stack>
}