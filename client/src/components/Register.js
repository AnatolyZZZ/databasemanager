import {
  Stack, TextField, Button, Box, Collapse, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import MUIAlert from '@mui/material/Alert';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postData } from '../utils/api';
import { $alert, $delay, $navigate } from '../utils/ux';
import { setAlertError } from '../actions';
import { positionSelectOptions, levelSelectorOptions } from './enteties/registerInfo';

export function Register() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [successAlert, openSuccess] = useState(false);
  const [position, selectPosition] = useState('');
  const [experience, selectExp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const validate = () => {
    if (emailError) {
      $alert('Enter valid email');
      return false;
    }
    if (password !== passwordConfirm) {
      $alert('Passwords do not match ');
      setPasswordError(true);
      return false;
    }
    setPasswordError(false);

    return true;
  };

  const checkName = async () => {
    if (emailError) return false;
    const data = await postData('/api/client/check', { username });
    if (data?.exist) {
      $alert(`User with email ${username} already exists`);
      return false;
    }
    return true;
  };

  const isEmailValid = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(val);
    setEmailError(!valid);
    return valid;
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setUsername(newEmail);
    dispatch(setAlertError(false));
    isEmailValid(newEmail);
  };

  const validateAndRegister = async () => {
    let valid = isEmailValid(username);
    if (!valid) return;
    valid = validate();
    if (!valid) return;
    valid = await checkName();
    if (!valid) return;
    const data = await postData('/api/client/register', {
      password, username, companyName, experience, additionalInfo, position,
    });
    if (data && data?.status === 'ok') {
      openSuccess(true);
      await $delay(2000);
      $navigate('/');
    }
  };

  return (
    <Stack spacing={1}>
      <Collapse in={successAlert}>
        <MUIAlert severity="success" onClick={() => openSuccess(false)}>User registered!</MUIAlert>
      </Collapse>

      <TextField
        id="email"
        label="Email"
        variant="outlined"
        onChange={handleEmailChange}
        onBlur={checkName}
        error={emailError}
        required
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        onChange={(event) => {
          setPassword(event.target.value);
          dispatch(setAlertError(false));
        }}
        required
      />
      <TextField
        id="confirm_password"
        label="Confirm password"
        variant="outlined"
        onChange={(event) => {
          setPasswordConfirm(event.target.value);
          dispatch(setAlertError(false));
        }}
        onBlur={validate}
        error={passwordError}
        required
      />
      <Stack spacing={1}>
        <Stack spacing={1} direction="row">
          <TextField
            id="company_name"
            label="Company name"
            variant="outlined"
            onChange={(event) => setCompanyName(event.target.value)}
          />

          <FormControl size="large" sx={{ m: 1, width: 192 }}>
            <InputLabel id="select-position">Opened position</InputLabel>
            <Select
              labelId="select-position"
              id="position-selector"
              value={position}
              label="Opened position"
              onChange={(e) => selectPosition(e.target.value)}
            >
              <MenuItem disabled value="">
                <em>Opened position</em>
              </MenuItem>
              {positionSelectOptions.map(({ id, value, label }) => <MenuItem value={value} key={id}>{label}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="large" sx={{ m: 1, width: 192 }}>
            <InputLabel id="select-experience">Required experience</InputLabel>
            <Select
              labelId="select-position"
              id="experience-selector"
              value={experience}
              label="Required experience"
              onChange={(event) => selectExp(event.target.value)}
            >
              <MenuItem disabled value="">
                <em>Required experience</em>
              </MenuItem>
              {levelSelectorOptions.map(({ id, value, label }) => <MenuItem value={value} key={id}>{label}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>

        {
            (position === 'other' || experience === 'other')
            && (
            <TextField
              id="additional-info"
              label="Please, specify other"
              variant="outlined"
              fullWidth
              onChange={(event) => setAdditionalInfo(event.target.value)}
            />
            )
            }
      </Stack>
      <Box>
        <Box
          sx={{ width: '33%', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <Button variant="contained" color="warning" fullWidth onClick={validateAndRegister}>Register</Button>
        </Box>
      </Box>

    </Stack>
  );
}
