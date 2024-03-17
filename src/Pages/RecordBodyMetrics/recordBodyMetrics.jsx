import React, { useState, useEffect } from 'react';
import './recordBodyMetrics.css';
import API from '../../Resources/api';
import { UseAppContext } from '../../Context/app-context';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Axios from 'axios';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { DateTime } from 'luxon';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import { ChevronLeft } from '@mui/icons-material';

const RecordBodyMetrics = () => {
  const { currentUserParsed, loggedIn } = UseAppContext();
  const { id } = currentUserParsed;
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [error, setError] = useState({ status: false, msg: '' });
  const [formValues, setFormValues] = useState({
    chestCircumference: '',
    waistCircumference: '',
    hipCircumference: '',
    date: DateTime.local().setZone('America/Vancouver'),
  });

  const defaultDate = DateTime.local().setZone('America/Vancouver')
  localStorage.setItem('ExerciseDate', defaultDate.toISODate());
  
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
  };

  const submitBodyMetrics = async (e) => {
    e.preventDefault();
    try {
      const { waistCircumference, hipCircumference, chestCircumference, date } = formValues;
      if (!waistCircumference || !hipCircumference || !chestCircumference) {
        setError({ status: true, msg: 'Please provide all fields' });
        setTimeout(()=>{
          setError({ status: false, msg: '' });
        }, 4000)
      }

      const options = {
        url: `${API}/metrics/${id}/body-metrics`,
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: {
          userId: id,
          chestCircumference: chestCircumference,
          waistCircumference: waistCircumference,
          hipCircumference: hipCircumference,
          date: date.toISODate(),  
        },
      };

      const result = await Axios(options);
      const { response } = result.data;

      if (response === 'Success') {
        return (window.location.href = `/report/${id}`);
      } else if (response === 'Fail') {
        const { message } = result.data;
        handleError(true, message);
        setTimeout(() => {
          setError({ status: false, msg: '' });
        }, 4000);
      }
    } catch (error) {
      handleError(true, "Error recording body metrics");
    }
  };


  const fetchBodyDataByDate = async()=>{
    const dateValue = formValues.date.toISODate()
    const options = {
        url: `${API}/metrics/${id}/${dateValue}/body-metrics`,
        method : "GET",
        headers : {
            "Accept" : "application/json",
            "Content-Type" : "application/json;charset=UTF-8"
        }
    }
    const result = await Axios(options)
    
    const {response, bodyMetrics} = result.data
    if(response == 'Success'){
        return(bodyMetrics)
    }else if(response == 'Fail'){
      setError({status : true, msg : "Failed to fetch body metrics report"})
      return setTimeout(()=>{
        setError({status : false, msg :''})
      }, 4000)
    }
}

  const handleSkipBodyData = () => {
    const bodyDataByDate = fetchBodyDataByDate()
    bodyDataByDate.then(bodyData =>{
      if (bodyData) {
        window.location.href = `/report/${id}`;
      } else {
        setConfirmationOpen(true);
      }  
    })
    
  }

  const confirmSkipBodyData = () => {
    setConfirmationOpen(false);
    return window.location.href = `/report/${id}`
  }

  const cancelSkipBodyData = () => {
    setConfirmationOpen(false);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if(loggedIn == "false" || !loggedIn){
    return window.location.href = `/sign-in`
  }

  return (
    <div className='user-body-data'>
      {confirmationOpen && (
            <div className="warning" severity="warning">
              <p className='skip-text'>No body metrics record is found for this date. Skipping body metrics would result 
              in loss of data for this date.<br />
              Are you sure you want to skip recording body metrics?</p>
              <div className="skip-btns">
                <Button className='user-skip-btn' style={{color:"var(--color3)"}} onClick={confirmSkipBodyData}>Yes</Button>
                <Button className='user-skip-btn' style={{color:"var(--color3)"}} onClick={cancelSkipBodyData}>No</Button>
              </div>
            </div>
          )}
     <div className='links'>
        <Link to={`/`} className='back-link' >
            <Button style={{color:"var(--color-8)", zIndex:"2"}} >
            <ChevronLeft style={{color:"var(--color-8)"}}/>  
            Back
            </Button>
        </Link>
      </div>
    <Grid container >
      {error.status && (
        <div className='alert' style={{ position: 'absolute', zIndex:"3" }}>
          <Alert severity='error'>{error.msg}</Alert>
        </div>
      )}
      <Grid item xs={12}>
        <h3 className='user-body-data-title'>Body Metrics</h3>
      </Grid>
      <Grid item sm={12} md={4}></Grid>
      <Grid item sm={12} md={4} className='user-body-data-form'>
        <TextField
          className='user-body-data-input'
          value={formValues.chestCircumference}
          onChange={(e) => setValues('chestCircumference', e.target.value)}
          type='number'
          name='chestCircumference'
          label='Chest Circumference'
          style={{ marginTop: '0.7rem' }}
        />
        <TextField
          className='user-body-data-input'
          value={formValues.waistCircumference}
          onChange={(e) => setValues('waistCircumference', e.target.value)}
          type='number'
          name='waistCircumference'
          label='Waist Circumference'
          style={{ marginTop: '0.7rem' }}
        />
        <TextField
          className='user-body-data-input'
          value={formValues.hipCircumference}
          onChange={(e) => setValues('hipCircumference', e.target.value)}
          type='number'
          name='hipCircumference'
          label='Hip Circumference'
          style={{ marginTop: '0.7rem', marginBottom: '2rem' }}
        />
        <DatePicker
          selected={formValues.date.toJSDate()}
          onChange={(date) => handleDateChange(DateTime.fromJSDate(date).setZone('America/Vancouver'))}          
        />
        <div className='user-body-data-btns'>
            <Button className='user-body-data-btn' variant='outlined' 
            onClick={handleSkipBodyData}
            style={{color:"var(--color3)"}}>
              Skip body metrics
            </Button>
          
          <Button className='user-body-data-btn' variant='contained' onClick={submitBodyMetrics}>
            Save and continue
          </Button>
        </div>
      </Grid>
      <Grid item sm={12} md={4}></Grid>
    </Grid>
    </div>
  );
};

export default RecordBodyMetrics;
