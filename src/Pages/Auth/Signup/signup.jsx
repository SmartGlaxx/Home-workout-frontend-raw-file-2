import React, { useState, useEffect } from 'react';
import './signup.css';
import API from '../../../Resources/api';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { UseAppContext } from '../../../Context/app-context';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Signup = () => {
  const { loggedIn } = UseAppContext();
  const [error, setError] = useState({ status: false, msg: '' });
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const handleError = (status, message) => {
    setError({ status: status, msg: message });
    setTimeout(()=>{
      setError({ status: false, msg: '' });
    }, 4000)
  };

  const setValues = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'username') {
      value = value.replace(/\s+/g, '');
    }
    setFormValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const signUp = async (e) => {
    try {
      e.preventDefault();
      const { firstname, lastname, username, email, password1, password2 } = formValues;

      const options = {
        url: `${API}/auth/sign-up`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          firstname: firstname,
          lastname: lastname,
          username: username,
          email: email,
          password: password1,
        },
      };

      const result = await Axios(options);
      const { response, user } = result.data;

      if (response === 'Success') {
        return (window.location.href = `/profiling/${user._id}`);
      } else if (response === 'Fail') {
        const { message } = result.data;
        handleError(true, message);

      }
    } catch (error) {
      handleError(true, error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loggedIn === 'true') {
    return (window.location.href = '/');
  }

  return (
    <Grid container className="signup">
      {error.status && (
        <div className="alert" style={{ position: 'absolute', zIndex:"3" }}>
          <Alert severity="error">{error.msg}</Alert>
        </div>
      )}

      <Grid item xs={12} sm={6}  className="signup-heading">
        <h2 className="signup-heading-title">
          Home Workout <br/>
          <span className='signup-heading-title-center'>&</span><br/> 
          <span className='signup-heading-title-bottom'>Analytics</span></h2>
      </Grid>

      <Grid item xs={12} sm={6}  className="signup-form">
        <div className="signup-form-inner">
          <h4 className="sign-up-title">Sign Up</h4>
          <TextField
            className="signup-input"
            value={formValues.firstname}
            onChange={setValues}
            type="text"
            name="firstname"
            label="Firstname"
            style={{ marginTop: '0.7rem' }}
          />
          <TextField
            className="signup-input"
            value={formValues.lastname}
            onChange={setValues}
            type="text"
            name="lastname"
            label="Lastname"
            style={{ marginTop: '0.7rem' }}
          />
          <TextField
            className="signup-input"
            value={formValues.username}
            onChange={setValues}
            type="text"
            name="username"
            label="Username"
            style={{ marginTop: '0.7rem' }}
          />
          <TextField
            className="signup-input"
            value={formValues.email}
            onChange={setValues}
            type="email"
            name="email"
            label="E-Mail"
            style={{ marginTop: '0.7rem' }}
          />
          <TextField
            className="signup-input"
            value={formValues.password1}
            onChange={setValues}
            type="password"
            name="password1"
            label="Password"
            style={{ marginTop: '0.7rem' }}
          />
          <TextField
            className="signup-input"
            value={formValues.password2}
            onChange={setValues}
            type="password"
            name="password2"
            label="Confirm Password"
            style={{ marginTop: '0.7rem' }}
          />
          <div className="auth-btns">
            <Button variant="contained" className="auth-signup-btn-main" onClick={signUp}>
              Sign up
            </Button>
          </div>
          <div className="auth-alt-text">
            Already have an account? <br />
            <Link to="/sign-in" className="auth-signup-btn">
              Sign in
            </Link>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default Signup;
