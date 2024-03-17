import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WorkoutData } from '../../Resources/data';
import { DummyWorkoutData } from '../../Resources/data';
import { UseAppContext } from '../../Context/app-context';
import Alert from '@mui/material/Alert';
import "./workoutSessions.css"
import { Backdrop, Sidebar, Topbar } from '../../Components';
import Axios from 'axios';
import API from '../../Resources/api';
import { Button } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';

const WorkoutSessions = () => {
    const { category } = useParams();
    const { exercises } = WorkoutData;
    const [currentWorkouts, setCurrentWorkouts] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentExercise, setCurrentExercise] = useState(null);
    const [timer, setTimer] = useState(0);
    const [error, setError] = useState({ status: false, msg: '' });
    const [preparationTimer, setPreparationTimer] = useState(0);
    let [totalCaloriesBurnt, setTotalCaloriesBurnt] = useState(0)
    const {currentUserParsed, loggedIn, exerciseDate} = UseAppContext()
    const {id, weight} = currentUserParsed

    let metabolicEquivalent = 0

    useEffect(() => {
        const mainCurrentWorkouts = exercises.filter(exercise => exercise.category.toLowerCase() === category)
        setCurrentWorkouts([DummyWorkoutData,...mainCurrentWorkouts]);
    }, [category, exercises]);

    useEffect(() => {
        if (currentWorkouts.length > 0) {
            setCurrentExercise(currentWorkouts[currentExerciseIndex]);
            setPreparationTimer(currentWorkouts[currentExerciseIndex].preparationTime);
            metabolicEquivalent+= currentWorkouts[currentExerciseIndex].metabolicEquivalent
            let caloriesPerMin = (metabolicEquivalent * 3.5 * weight) / 200 
            let caloriesForCurrentExercise = caloriesPerMin * (currentWorkouts[currentExerciseIndex].duration/60)
            totalCaloriesBurnt += caloriesForCurrentExercise
            setTotalCaloriesBurnt(totalCaloriesBurnt)
        } else {
            setCurrentExercise(null);
        }
    }, [currentWorkouts, currentExerciseIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPreparationTimer(prevTimer => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (preparationTimer === 0 && currentWorkouts[currentExerciseIndex]) {
            setTimer(currentWorkouts[currentExerciseIndex].duration);
        }
    }, [preparationTimer, currentExerciseIndex, currentWorkouts]);
    

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            const nextExerciseIndex = currentExerciseIndex + 1;
            if (nextExerciseIndex < currentWorkouts.length) {
                setCurrentExerciseIndex(nextExerciseIndex);
                setPreparationTimer(currentWorkouts[nextExerciseIndex].preparationTime);
                setTimer(currentWorkouts[nextExerciseIndex].duration);
            } else {
                setCurrentExercise(null);
            }
        }
    }, [timer, currentExerciseIndex, currentWorkouts]);


    const updateDatabaseRecord = async (calories) => {
        
        try{
            const options = {
                url: `${API}/health/${id}/${exerciseDate}/health-metrics`,
                method: 'PATCH',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                data: {
                    caloriesBurned : calories.toFixed(2)
                },
              };
          
              const result = await Axios(options);
                 
        }catch(error){
            setError({ status: true, msg: "Error updating calories" });
        }
      };
    
      useEffect(() => {
        updateDatabaseRecord(totalCaloriesBurnt);    
      }, [totalCaloriesBurnt]);


      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);


    if(loggedIn == "false" || !loggedIn){
        return window.location.href = `/sign-in`
    }

    if(error.status){
        return<div className="alert" style={{ position: 'absolute', zIndex:"3" }}>
            <Alert severity="error">{error.msg}</Alert>
        </div>
    }
    

    return (<>
        <Topbar />
        <Sidebar />
        <Backdrop />
        <div className='workout-session' >
        {/* <div style={{background:'red', width:"100%", justifyContent:"start" }}>
        <Link to={`/`} className='back-link' style={{float:"left"}}>
            <Button style={{color:"var(--color-8)", float:"left"}} >
            <ChevronLeft style={{color:"var(--color-8)"}}/>  
            Back
            </Button>
        </Link>
        </div> */}
        <div className='workout-session-inner' >
            {currentExercise ? (
                <div className='workout-session-container'>
                    <h3>{currentExercise.name}</h3>
                    <h5>
                    {preparationTimer > 0 ? (
                        <span className='preparation-time'>Get Ready: {preparationTimer} seconds</span>
                    ) : (
                        <span className='duration'> {timer} seconds</span>
                    )}
                    </h5>
                    <div>
                    {
                        preparationTimer < 2 && preparationTimer > -1 && <div className='start-notice'>START</div>
                    }
                    </div>
                    <iframe
                    className='iframe'
                    src={currentExercise.video}
                    title="Home workout video"
                    frameBorder="0"
                    allow='autoplay; fullscreen; encrypted-media; picture-in-picture'
                    allowfullscreen
                    autoPlay
                    ></iframe>
                    <p>{currentExercise.description}</p>
                </div>
                ) : (  
                <div className='workout-complete'>
                    <h4>Workout Completed</h4>
                    <h5>Total Calories Burnt: {totalCaloriesBurnt.toFixed(2)} cal</h5>
                    <Link to={`/record-body-metrics/${id}`} ><button className="competed-button">Record Body Metrics</button></Link>
                </div>
            )}
        </div>
        </div>
    </>);
};

export default WorkoutSessions;
