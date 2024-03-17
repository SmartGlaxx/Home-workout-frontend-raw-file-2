import React, {useState, useEffect } from 'react'
import {Link, useParams} from "react-router-dom"
import { UseAppContext } from '../../Context/app-context'
import Axios from 'axios'
import { Table } from 'react-bootstrap';
import API from '../../Resources/api'
import { Backdrop, Sidebar, Topbar } from '../../Components'
import "./riskAssessment.css"
import { ChevronLeft } from '@mui/icons-material';
import { Button } from '@mui/material';
import { WorkoutData } from '../../Resources/data';

const RiskAssessment = () => {
    const {currentUserParsed} = UseAppContext()
    const [healthData, setHealthData] = useState({})
    const [healthDataSystolic, setHealthDataSystolic]= useState(0)
    const [healthDataDiastolic, setHealthDataDiastolic]= useState(0)
    const [healthDataResting, setHealthDataResting]= useState(0)
    const [error, setError] = useState({ status: false, msg: '' });
    const [assessmentResponseSystolic, setAssessmentResponseSystolic] = useState("")
    const [assessmentResponseDiastolic, setAssessmentResponseDiastolic] = useState("")
    const [assessmentResponseResting, setAssessmentResponseResting] = useState("")
    const [assessmentResponseBmi, setAssessmentResponseBmi] = useState("")
    const {firstname, fitnessGoals, fitnessLevel, height, 
        medicalHistory, weight} = currentUserParsed
    const {id} = useParams()

    const apiKey = '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';
    const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';

    const bmi = (weight/((height/100) * (height/100))).toFixed(2) 

    const exerciseNames = WorkoutData.exercises.map(exercise => exercise.name);
    const exerciseNamesString = exerciseNames.join(', ');

    async function chatResponseForSystolicPressure(healthDataSystolic) {
        try {
            const response = await Axios.post(
                chatGptEndpoint,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a health advisor.' },
                        {
                            role: "user", content: `provide a risk assessment for my health base on the systolic Pressure  
                            value of ${healthDataSystolic}. Recommend 3 or less exercises in ${exerciseNamesString}. Keep it to less then 45 words`
                        }
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            
            setAssessmentResponseSystolic(response.data.choices[0].message.content);
            
        } catch (error) {
            throw error;
        }
        
    }
    async function chatResponseForDiastolicPressure(healthDataDiastolic) {
        try {
            const response = await Axios.post(
                chatGptEndpoint,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a health advisor.' },
                        {
                            role: "user", content: `provide a risk assessment for my health base on the diastolic Pressure  
                            value of ${healthDataDiastolic}. Recommend 3 or less exercises in ${exerciseNamesString}. Keep it to less then 45 words`
                        }
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            
            setAssessmentResponseDiastolic(response.data.choices[0].message.content);
            
        } catch (error) {
            throw error;
        }
        
    }
    async function chatResponseForResting(healthDataResting) {
        try {
            const response = await Axios.post(
                chatGptEndpoint,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a health advisor.' },
                        {
                            role: "user", content: `provide a risk assessment for my health base on the resting heart rate  
                            value of ${healthDataResting}. Recommend 3 or less exercises in ${exerciseNamesString}. Keep it to less then 45 words`
                        }
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            
            setAssessmentResponseResting(response.data.choices[0].message.content);
            
        } catch (error) {
            throw error;
        }
        
    }

    
    async function chatResponseForBmi(bmi) {
        try {
            const response = await Axios.post(
                chatGptEndpoint,
                {
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a health advisor.' },
                        {
                            role: "user", content: `provide a risk assessment for my health base on the bmi  
                            value of ${bmi}. Keep it to less then 30 words`
                        }
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            
            setAssessmentResponseBmi(response.data.choices[0].message.content);
            
        } catch (error) {
            throw error;
        }
        
    }

    const fetchHealthData = async()=>{
      try{
        const options = {
            url: `${API}/health/${id}/health-metrics`,
            method : "GET",
            headers : {
                "Accept" : "application/json",
                "Content-Type" : "application/json;charset=UTF-8"
            }
        }
        const result = await Axios(options)
        const {response, healthMetrics} = result.data
      
        if(response == 'Success'){
            if (healthMetrics && healthMetrics.length > 0) {
                const latestHealthMetric = healthMetrics[healthMetrics.length - 1];
                setHealthDataSystolic(latestHealthMetric.systolicPressure);
                setHealthDataDiastolic(latestHealthMetric.diastolicPressure);
                setHealthDataResting(latestHealthMetric.restingHeartRate);
              } else {
                setError({ status: true, msg: 'No health data available' });
              }
        }else if(response == 'Fail'){
            setError({status : true, msg : "Failed to fetch health report"})
            return setTimeout(()=>{
                setError({status : false, msg :''})
        }, 4000)
        }
      }catch(error){
        setError({status: true, msg: "Error fetching your data"})
      }
    }


    useEffect(()=>{
        fetchHealthData()
    },[])
 

    useEffect(()=>{
        if(healthDataSystolic > 0 && healthDataDiastolic > 0 && healthDataResting > 0){
            chatResponseForSystolicPressure(healthDataSystolic)
            chatResponseForDiastolicPressure(healthDataDiastolic)
            chatResponseForResting(healthDataResting)
            chatResponseForBmi(bmi)
        }
    },[healthDataSystolic, healthDataDiastolic, healthDataResting, bmi])

    
    if(error.msg=="No health data available"){
        return <div>No health data available</div>
    }

    console.log("healthDataDiastolic" +healthDataDiastolic)
    console.log("healthDataSystolic" + healthDataSystolic)
    console.log("healthDataResting" + healthDataResting)
    console.log("bmi" + bmi)

  return (<>
    <Topbar />
    <Sidebar />
    <Backdrop />
        <div className="risk-assessment">
        <div className='links'>
            <Link to={`/report/${id}`} className='back-link'>
                <Button style={{color:"var(--color-8)"}}>
                <ChevronLeft style={{color:"var(--color-8)"}}/>  
                Back
                </Button>
            </Link>
        </div>
            <h5 className="analysis-header">Health Risk Analysis</h5>
        <table className='risk-assessment-table'>
      <thead>
        <tr>
          <th style={{padding:"var(--section-padding-2)"}}><h6>Health Data</h6></th>
          <th style={{padding:"var(--section-padding-2)"}}><h6>Risk Assessment</h6></th>
        </tr>
      </thead>
      <tbody >
        <tr style={{color:"#ef8686"}}>
          <td style={{padding:"var(--section-padding-2)"}}>Systolic pressure: {healthDataSystolic}mmHg</td>
          <td style={{padding:"var(--section-padding-2)"}}>{assessmentResponseSystolic}</td>
        </tr>
        <br />
        <tr style={{color: "#e5de19"}}>
          <td style={{padding:"var(--section-padding-2)"}}>Diastolic Pressure: {healthDataDiastolic}mmHg</td>
          <td style={{padding:"var(--section-padding-2)"}}>{assessmentResponseDiastolic}</td>
        </tr>
        <br />
        <tr style={{color: "#e80d0d"}}>
          <td style={{padding:"var(--section-padding-2)"}}>Resting Heart Rate: {healthDataResting}bpm</td>
          <td style={{padding:"var(--section-padding-2)"}}>{assessmentResponseResting}</td>
        </tr>
        <br />
        <tr style={{color: "#e80d0d"}}>
          <td style={{padding:"var(--section-padding-2)"}}
          className={bmi < 18.5 ? "underweight": 
          bmi > 18.5 && bmi < 24.9 ? "normal-weight" : 
          bmi > 25 && bmi < 29.9 ? "overweight" :
          bmi > 40 ? "obese" : ""}
          >Body Mass Index(BMI): {bmi}kg/m<sup>2</sup></td>
          <td style={{padding:"var(--section-padding-2)"}} 
          className={bmi < 18.5 ? "underweight": 
          bmi > 18.5 && bmi < 24.9 ? "normal-weight" : 
          bmi > 25 && bmi < 29.9 ? "overweight" :
          bmi > 40 ? "obese" : ""}>{assessmentResponseBmi}</td>
        </tr>
      </tbody>
    </table>
    </div>
    </>
  )
}

export default RiskAssessment
