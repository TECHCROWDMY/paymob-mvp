import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import Iconify from '../../../components/iconify';
import Api from '../../../api/routes'

// ----------------------------------------------------------------------
// LoginForm.propTypes = {
//   email: PropTypes.string,
//   password: PropTypes.string,

// };


export default function LoginForm() {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleLogin = () => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    axios.post(Api.Login, formData)
      .then(response => {
        console.log('Login response:', response.data);
        // Handle the response data here
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the error here
      });
    navigate('/app', { replace: true });
  };




  return (
    <>
      <Stack spacing={3}>
        <TextField
        value={email}
        name="email" label="Email address"  
        onChange={handleEmailChange}
        />

        <TextField
          name="password"
          value={password}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={handlePasswordChange}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton onClick={handleLogin} fullWidth size="large" type="submit" variant="contained">
        Login
      </LoadingButton>
    </>
  );
}
