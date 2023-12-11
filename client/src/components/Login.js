import { Stack, TextField, Box, Button } from '@mui/material';

export const Login = (props) => {
    return <Stack spacing={1}>
        <TextField id="username" label="Username" variant="outlined" />
        <TextField id="password" label="Password" variant="outlined" />
        <Box sx={{width: '100%', height : '55px'}}></Box>
        <Box><Box sx={{width: '33%', marginLeft: 'auto', marginRight: 'auto'}}><Button variant='contained'  fullWidth>Login</Button></Box></Box>
    </Stack>
}