import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import API from '../../Resources/api';
import Axios from 'axios';
import { UseAppContext } from '../../Context/app-context';
import './userprofiling.css';

const UserProfiling = () => {
  const { loggedIn } = UseAppContext();
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const [selectedGender, setSelectedGender] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [weightLossChecked, setWeightLossChecked] = useState(false);
  const [muscleGainChecked, setMuscleGainChecked] = useState(false);
  const [enduranceImprovementChecked, setEnduranceImprovementChecked] = useState(false);
  const [functionalFitnessChecked, setFunctionalFitnessChecked] = useState(false);
  const [error, setError] = useState({ status: false, msg: '' });
  const [formValues, setFormValues] = useState({
    age: '',
    height: '',
    weight: '',
    medicalHistory: '',
  });

  const handleError = (status, message) => {
    setError({ status: status, msg: message });
    setTimeout(()=>{
      setError({ status: false, msg: '' });
    },4000)
  };

  const handleCheckboxChange = (sport) => {
    switch (sport) {
      case 'weightLoss':
        setWeightLossChecked(!weightLossChecked);
        break;
      case 'muscleGain':
        setMuscleGainChecked(!muscleGainChecked);
        break;
      case 'enduranceImprovement':
        setEnduranceImprovementChecked(!enduranceImprovementChecked);
        break;
      case 'functionalFitness':
        setFunctionalFitnessChecked(!functionalFitnessChecked);
        break;
      default:
        break;
    }
  };

  const setValues = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setFormValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleFitnessLevelChange = (event) => {
    setFitnessLevel(event.target.value);
  };

  const getUser = async () => {
    const result = await Axios(`${API}/user/${id}/profile`);
    const { data } = result;
    if (data) {
      setUserData(data);
    } else {
      handleError({ status: true, msg: 'User information not found' });
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const submitUserProfile = async (e) => {
    e.preventDefault();

    const selectedSports = [];

    if (weightLossChecked) {
      selectedSports.push('Weight Loss');
    }
    if (muscleGainChecked) {
      selectedSports.push('Muscle Gain');
    }
    if (enduranceImprovementChecked) {
      selectedSports.push('Endurance Improvement');
    }
    if (functionalFitnessChecked) {
      selectedSports.push('Functional Fitness');
    }

    const { age, height, weight, medicalHistory } = formValues;
    const {
      age: storedAge,
      gender: storedGender,
      height: storedHeight,
      weight: storedWeight,
      medicalHistory: storedMedicalHistory,
      fitnessLevel: storedFitnessLevel,
      fitnessGoals: storedFitnessGoals,
    } = userData;

    if (!age && !height && !weight && !medicalHistory) {
      return handleError(true, 'Please fill in your data');
    }
    if (!fitnessLevel) {
      return handleError(true, 'Please select a fitness level');
    }
    if (
      !weightLossChecked &&
      !muscleGainChecked &&
      !enduranceImprovementChecked &&
      !functionalFitnessChecked
    ) {
      return handleError(true, 'Select one fitness goal');
    }
    const options = {
      url: `${API}/user/${id}/profile`,
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: {
        age: age ? age : storedAge,
        gender: selectedGender ? selectedGender : storedGender,
        height: height ? height : storedHeight,
        weight: weight ? weight : storedWeight,
        medicalHistory: medicalHistory ? medicalHistory : storedMedicalHistory,
        fitnessLevel: fitnessLevel ? fitnessLevel : storedFitnessLevel,
        fitnessGoals: selectedSports.length > 0 ? selectedSports : storedFitnessGoals,
      },
    };

    const result = await Axios(options);
    const { response } = result.data;
    if (response === 'Success') {
      return (window.location.href = `/record-health-metrics/${id}`);
    } else if (response === 'Fail') {
      const { message } = result.data;
      handleError(true, message);
      setTimeout(() => {
        setError({ status: false, msg: '' });
      }, 4000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Grid container className="user-profiling">
          {error.status && (
            <div className="alert" style={{ zIndex:"3"}}>
              <Alert severity="error">{error.msg}</Alert>
            </div>
          )}

          <Grid item xs={12}>
            <h3 className="user-profiling-title">Set up Profile</h3>  
          </Grid>
          <Grid item xs={12} sm={4} ></Grid>
          <Grid item xs={12} sm={4} className="user-profiling-form">
            <TextField
              className="user-profiling-input"
              value={formValues.age}
              onChange={setValues}
              type="number"
              name="age"
              label="Age"
              style={{ marginTop: '0.7rem' }}
              fullWidth
            />
            <Select
              className="user-profiling-dropdown"
              value={selectedGender}
              onChange={handleSelectChange}
              displayEmpty
              fullWidth
            >
              <MenuItem value="" disabled>
                Select gender
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
            <TextField
              className="user-profiling-input"
              value={formValues.height}
              onChange={setValues}
              type="number"
              name="height"
              label="Height(cm)"
              style={{ marginTop: '0.7rem' }}
              fullWidth
            />
            <TextField
              className="user-profiling-input"
              value={formValues.weight}
              onChange={setValues}
              type="number"
              name="weight"
              label="Weight(kg)"
              style={{ marginTop: '0.7rem' }}
              fullWidth
            />
            <TextField
              className="user-profiling-input"
              value={formValues.medicalHistory}
              onChange={setValues}
              type="text"
              name="medicalHistory"
              label="Medical History"
              style={{ marginTop: '0.7rem' }}
              multiline
              fullWidth
            />

            <h3 className="user-profiling-subtitle">Select Fitness Level</h3>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fitnessLevel === 'beginner'}
                    onChange={handleFitnessLevelChange}
                    value="beginner"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>Less than 10 push-ups</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fitnessLevel === 'intermediate'}
                    onChange={handleFitnessLevelChange}
                    value="intermediate"
                  />
                }                
                label={<span style={{ color: 'var(--color4)' }}>10 - 20 push-ups</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fitnessLevel === 'advanced'}
                    onChange={handleFitnessLevelChange}
                    value="advanced"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>More than 20 push-ups</span>}
              />
            </FormGroup>

            <h3 className="user-profiling-subtitle">Fitness Goals</h3>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={weightLossChecked}
                    onChange={() => handleCheckboxChange('weightLoss')}
                    value="weightLoss"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>Weight Loss</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={muscleGainChecked}
                    onChange={() => handleCheckboxChange('muscleGain')}
                    value="muscleGain"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>Muscle Gain</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enduranceImprovementChecked}
                    onChange={() => handleCheckboxChange('enduranceImprovement')}
                    value="enduranceImprovement"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>Endurance Improvement</span>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={functionalFitnessChecked}
                    onChange={() => handleCheckboxChange('functionalFitness')}
                    value="functionalFitness"
                  />
                }
                label={<span style={{ color: 'var(--color4)' }}>Functional Fitness</span>}
              />
            </FormGroup>

            <div className="user-profiling-btns">
              <Button
                className="user-profiling-btn"
                variant="contained"
                onClick={submitUserProfile}
              >
                Save and continue
              </Button>
            </div>
        </Grid>
        <Grid item xs={12} sm={4} ></Grid>
      </Grid>
  );
};

export default UserProfiling;
