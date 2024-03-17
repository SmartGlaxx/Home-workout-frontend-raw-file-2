import React, { useState, useEffect } from 'react';
import './recordHealthMetrics.css';
import API from '../../Resources/api';
import { Link, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Axios from 'axios';
import { UseAppContext } from '../../Context/app-context';
import Grid from '@mui/material/Grid';
import { TextField, Button } from '@mui/material';
import { DateTime } from 'luxon';  


const RecordHealthData = () => {
  const { loading, loggedIn } = UseAppContext();
  const { id } = useParams();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [error, setError] = useState({ status: false, msg: '' });
  const [dateButtonClicked, setDateButtonClicked] = useState(false)
  const [formValues, setFormValues] = useState({
    systolicPressure: '',
    diastolicPressure: '',
    restingHeartRate: '',
    date: DateTime.local().setZone('America/Vancouver'),  
  });

  useEffect(()=>{
    if(!dateButtonClicked){
      const defaultDate = DateTime.local().setZone('America/Vancouver')
      localStorage.setItem('ExerciseDate', defaultDate.toISODate());
    }
  },[dateButtonClicked])

  const handleError = (status, message) => {
    setError({ status: status, msg: message });
    setTimeout(()=>{
      setError({ status: false, msg: '' });
    }, 4000)
  };

  const setValues = (name, value) => {
    setFormValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleDateChange = (date) => {
    setValues('date', date);
    localStorage.setItem('ExerciseDate', date.toISODate());
    setDateButtonClicked(true)
  };

  const submitHealthData = async (e) => {
    e.preventDefault();
    try {
      const { systolicPressure, diastolicPressure, restingHeartRate, date } = formValues;
      if(!systolicPressure || !diastolicPressure || !restingHeartRate){
        setError({status: true, msg:"Please provide all fields"})
        setTimeout(()=>{
          setError({ status: false, msg: '' });
        }, 4000)
      }
      const options = {
        url: `${API}/health/${id}/health-metrics`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userId: id,
          systolicPressure: systolicPressure,
          diastolicPressure: diastolicPressure,
          restingHeartRate: restingHeartRate,
          date: date.toISODate(), 
        },
      };

      const result = await Axios(options);
      const { response } = result.data;
      if (response === 'Success') {
        return (window.location.href = '/');
      } else if (response === 'Fail') {
        const { message } = result.data;
        handleError(true, message);
        setTimeout(() => {
          setError({ status: false, msg: '' });
        }, 4000);
      }
    } catch (error) {
      handleError(true, error.message);
    }
  };

  const fetchHealthDataByDate = async()=>{
    const dateValue = formValues.date.toISODate()
    const options = {
        url: `${API}/health/${id}/${dateValue}/health-metrics`,
        method : "GET",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;charset=UTF-8"
        }
    }
    const result = await Axios(options)
    
    const {response, healthMetrics} = result.data
    if(response == 'Success'){
        return(healthMetrics)
    }else if(response == 'Fail'){
      setError({status : true, msg : "Failed to fetch health report"})
      return setTimeout(()=>{
        setError({status : false, msg :''})
      }, 4000)
    }
}

  const handleSkipHealthData = () => {
    const healthDataByDate = fetchHealthDataByDate()
    healthDataByDate.then(healthData =>{
      if (healthData) {
        window.location.href = "/";
      } else {
        setConfirmationOpen(true);
      }  
    })
    
  }


  const confirmSkipHealthData = () => {
    setConfirmationOpen(false);
    return window.location.href = "/"
  }

  const cancelSkipHealthData = () => {
    setConfirmationOpen(false);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if(loggedIn == "false" || !loggedIn){
    return window.location.href = `/sign-in`
  }

  return (
    <Grid container className='user-health-data'>
            {confirmationOpen && (
            <div className="warning" severity="warning">
              <p className='skip-text'>No health metrics record is found for this date. Skipping health data would result 
              in loss of data for this date.<br />
              Are you sure you want to skip recording health data?</p>
              <div className="skip-btns">
                <Button className='user-skip-btn' style={{color:"var(--color3)"}} onClick={confirmSkipHealthData}>Yes</Button>
                <Button className='user-skip-btn' style={{color:"var(--color3)"}} onClick={cancelSkipHealthData}>No</Button>
              </div>
            </div>
          )}
      <Grid container justifyContent='center'>
        {
            error.status && <div className='alert' style={{position:"absolute", zIndex:"3"}}>
            <Alert severity="error">{error.msg}</Alert>
          </div>
          }

          <Grid item xs={12} >
            <h3 className='user-health-data-title'>Health Data</h3>
          </Grid>
          <Grid item sm={12} md={4}></Grid>
          <Grid item sm={12} md={4} className='user-health-data-form' >
            <TextField
              className='user-health-data-input'
              value={formValues.systolicPressure}
              onChange={(e) => setValues('systolicPressure', e.target.value)}
              type='number'
              name='systolicPressure'
              label='Systolic Pressure'
              style={{ marginTop: '0.7rem' }}
              fullWidth
            />
            <TextField
              className='user-health-data-input'
              value={formValues.diastolicPressure}
              onChange={(e) => setValues('diastolicPressure', e.target.value)}
              type='number'
              name='diastolicPressure'
              label='Diastolic Pressure'
              style={{ marginTop: '0.7rem' }}
              fullWidth
            />
            <TextField
              className='user-health-data-input'
              value={formValues.restingHeartRate}
              onChange={(e) => setValues('restingHeartRate', e.target.value)}
              type='number'
              name='restingHeartRate'
              label='Resting Heart Rate'
              style={{ marginTop: '0.7rem', marginBottom:"2rem" }}
              fullWidth
            />
            <DatePicker
              selected={formValues.date.toJSDate()} 
              onChange={(date) => handleDateChange(DateTime.fromJSDate(date).setZone('America/Vancouver'))}
            />
            <div className='user-health-data-btns'>
                <Button className='user-health-data-btn' variant='outlined' 
                onClick={handleSkipHealthData}
                style={{color:"var(--color3)"}}>
                  Skip health data
                </Button>
              <Button className='user-health-data-btn' variant='contained' onClick={submitHealthData}>
                Save and continue
              </Button>
            </div>
          </Grid>
          <Grid item sm={12} md={4}></Grid>
        </Grid>
      </Grid>
  );
};

export default RecordHealthData;
