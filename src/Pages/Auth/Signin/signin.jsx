import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import { UseAppContext } from '../../../Context/app-context';
import API from '../../../Resources/api';
import Axios from 'axios';
import './signin.css';

const SignIn = () => {
  const { loading, loggedIn, setCurrentUser, setLoggedIn } = UseAppContext();
  const [error, setError] = useState({ status: false, msg: '' });
  const [formValues, setFormValues] = useState({
    emailOrUsername: '',
    password: '',
  });

  const handleError = (status, message) => {
    setError({ status: status, msg: message });
    setTimeout(()=>{
      setError({ status: false, msg: '' });
    }, 4000)
  };

  const setLoginValues = (value, loginData) => {
    setCurrentUser(loginData);
    setLoggedIn(value);
  };

  const setValues = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  if (loggedIn === 'true') {
    return (window.location.href = '/');
  }

  const signIn = async (e) => {
    try {
      e.preventDefault();
      const { emailOrUsername, password } = formValues;

      if (!emailOrUsername || !password) {
        setError({status: true, msg: 'Please enter E-mail or Username and Password'});
        setTimeout(() => {
          setError({ status: false, msg: '' });
        }, 4000);
      }
      const options = {
        url: `${API}/auth/sign-in`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
          emailOrUsername: emailOrUsername,
          password: password,
        },
      };

      const result = await Axios(options);

      const requestResponse = result.data.response;
      if (requestResponse === 'Success') {
        const { loginData } = result.data;

        setLoginValues(true, loginData);
        const { _id } = loginData;
        return (window.location.href = `/record-health-metrics/${_id}`);
      } else if (requestResponse === 'Fail') {
        const { message } = result.data;
        handleError(true, message);
      }
    } catch (error) {
      handleError(true, 'Error signing in');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid container className="signin">
      {error.status && (
        <div className="alert" style={{ position: 'absolute', zIndex:"3" }}>
          <Alert severity="error">{error.msg}</Alert>
        </div>
      )}
      <Grid item xs={12} sm={6}  className="signin-heading">
        <h2 className="signin-heading-title">
          Home Workout <br/>
          <span className='signin-heading-title-center'>&</span><br/> 
          <span className='signin-heading-title-bottom'>Analytics</span></h2>
      </Grid>
      <Grid item xs={12} sm={6}  className="signin-form">
        <div>
          <h4 className="sign-in-title">Sign in</h4>
          <TextField
            className="signin-input"
            value={formValues.emailOrUsername}
            onChange={setValues}
            type="text"
            name="emailOrUsername"
            label="E-mail/Username"
            variant="outlined"
            style={{ marginTop: '0.7rem' }}
            fullWidth
            required
          />
          <TextField
            className="signin-input"
            value={formValues.password}
            onChange={setValues}
            type="password"
            name="password"
            label="Password"
            variant="outlined"
            style={{ marginTop: '0.7rem' }}
            fullWidth
            required
          />
          <div className="auth-btns">
            <Button
              className="auth-signin-btn-main"
              variant="contained"
              onClick={signIn}
            >
              Sign in
            </Button>
          </div>
          <div className="auth-alt-text">
            New user?{' '}
            <Link to="/sign-up" className="auth-signin-btn">
              Register
            </Link>{' '}
            an account
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignIn;
