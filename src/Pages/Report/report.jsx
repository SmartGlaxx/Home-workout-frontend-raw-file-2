import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import Axios from 'axios'
import { useParams } from 'react-router-dom';
import { UseAppContext } from '../../Context/app-context';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import API from '../../Resources/api';
import "./report.css"
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js';
import { Backdrop, Sidebar, Topbar } from '../../Components';
import { Button } from '@mui/material';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const Report = () => {
    const [systolicPressure, setSystolicPressure] = useState([]);
    const [diastolicPressure, setDiastolicPressure] = useState([]);
    const [restingHeartRate, setRestingHeartRate] = useState([]);
    const [caloriesBurned, setCaloriesBurned] = useState([])
    const [chestCircumference, setChestCircumference] = useState([])
    const [waistCircumference, setWaistCircumference] = useState([])
    const [hipCircumference, setHipCircumference] = useState([])
    const [error, setError] = useState({status: false, msg :''})
    const {id} = useParams()
    const {currentUserParsed, loggedIn} = UseAppContext()
    const {weight, height} = currentUserParsed

    const fetchHealthData = async()=>{
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
                setRestingHeartRate(healthMetrics)
                setSystolicPressure(healthMetrics)
                setDiastolicPressure(healthMetrics)
                setCaloriesBurned(healthMetrics)
            }else if(response == 'Fail'){
                setError({status : true, msg : "Failed to fetch health report"})
                return setTimeout(()=>{
                    setError({status : false, msg :''})
            }, 4000)
            }
        }

    const fetchBodyMetrics = async()=>{
      const options = {
          url: `${API}/metrics/${id}/body-metrics`,
          method : "GET",
          headers : {
              "Accept" : "application/json",
              "Content-Type" : "application/json;charset=UTF-8"
          }
      }
      const result = await Axios(options)

      const {response, bodyMetrics} = result.data
      if(response == 'Success'){
          setChestCircumference(bodyMetrics)
          setWaistCircumference(bodyMetrics)
          setHipCircumference(bodyMetrics)
      }else if(response == 'Fail'){
          setError({status : true, msg : "Failed to fetch body metrics"})
          return setTimeout(()=>{
              setError({status : false, msg :''})
      }, 4000)
      }
  }

  useEffect(()=>{
    setTimeout(()=>{
      fetchHealthData()
    },1000)
  },[])

  useEffect(()=>{
    setTimeout(()=>{
      fetchBodyMetrics()
    },1000)
},[])
    


  const SystolicPressureChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Systolic Pressure',
          data: data.map(entry => entry.systolicPressure),
          borderColor: '#ef8686',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ef8686',
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Systolic Pressure',
          },
          suggestedMin: 0,
          suggestedMax: 180,
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };
  

  const DiastolicPressureChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Diastolic Pressure',
          data: data.map(entry => entry.diastolicPressure),
          borderColor: '#e5de19',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#e5de19',
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Diastolic Pressure',
          },
          suggestedMin: 0,
          suggestedMax: 180,
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };
  


  const RestingHeartRateChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Resting Heart Rate',
          data: data.map(entry => entry.restingHeartRate),
          borderColor: '#e80d0d',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#e80d0d',
        },
      ],
    };

    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Resting Heart Rate',
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    };

    return <Line data={chartData} options={chartOptions} />;
  };


  const CaloriesBurnedChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date).slice(-7),
      datasets: [
        {
          label: 'Calories Burned',
          data: data.map(entry => entry.caloriesBurned),
          borderColor: '#d07900',
          borderWidth: 2,
          pointRadius: 3,         
          pointBackgroundColor: '#d07900',
        },
      ],
    };

    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Calories Burned',
          },
          suggestedMin: 0,
          suggestedMax: 10,
        },
      },
    };

    return <Line data={chartData} options={chartOptions} />;
  };


  
  const ChestCircumferenceChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Chest Circumference',
          data: data.map(entry => entry.chestCircumference),
          borderColor: '#00a0d0',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#00a0d0',
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Chest Circumference',
          },
          suggestedMin: 0,
          suggestedMax: 60,
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };
  

  const WaistCircumferenceChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Waist Circumference',
          data: data.map(entry => entry.waistCircumference),
          borderColor: '#a0d000',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#a0d000',
        },
      ],
    };
  
    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Waist Circumference',
          },
          suggestedMin: 0,
          suggestedMax: 60,
        },
      },
    };
  
    return <Line data={chartData} options={chartOptions} />;
  };
  


  const HipCircumferenceChart = ({ data }) => {
    const chartData = {
      labels: data.map(entry => entry.date),
      datasets: [
        {
          label: 'Hip Circumference',
          data: data.map(entry => entry.hipCircumference),
          borderColor: '#00d092',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#00d092',
        },
      ],
    };

    const chartOptions = {
      scales: {
        x: {
          type: 'category',
          title: {
            display: true,
            text: 'Dates',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Hip Circumference',
          },
          suggestedMin: 0,
          suggestedMax: 60,
        },
      },
    };

    return <Line data={chartData} options={chartOptions} />;
  };

  if(loggedIn == "false" || !loggedIn){
      return window.location.href = `/sign-in`
  }

  const bmi = weight/((height/100) * (height/100)) 


  return (<>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <div className='report' >
    <div className="links">
    <Link to={`/record-body-metrics/${id}`} className='back-link'>
        <Button style={{color:"var(--color-8)", 
        marginLeft:"0rem", position: "static", marginTop: "0rem"}}>
        <ChevronLeft style={{color:"var(--color-8)"}}/>  
        Back
        </Button>
    </Link>
    <Link to={`/risk-assessment/${id}`} className='risk-assessment-link'>
      <Button style={{color:"var(--color-8)"}}>
        Get health risk assessment
        <ChevronRight style={{color:"var(--color-8)"}}/>  
      </Button>
    </Link>
    </div>
    <div className='chart-health-metrics'>
      <div style={{display: "flex", justifyContent:"space-between"}}>
      <h4 className="chart-header">Health Report</h4>
      </div>
    <div className='chart-containers' >
      <div className="chart-container" style={{background:"var(--background-overlay)"}}>
        <div className="chart-header">Systolic Pressure Chart</div>
        {systolicPressure && <SystolicPressureChart data={systolicPressure} />}
      </div>
      <div className="chart-container" style={{background:"var(--background-overlay)"}}>
        <div className="chart-header">Diastolic Pressure Chart</div>
        {diastolicPressure && <DiastolicPressureChart data={diastolicPressure} />}
      </div>
      <div className="chart-container" style={{background:"var(--background-overlay)"}}>
        <div className="chart-header">Resting Heart Rate Chart</div>
        {restingHeartRate && <RestingHeartRateChart data={restingHeartRate} />}
      </div>
    </div>
    </div>
    <div className='chart-body-metrics'>
      <h4 className="chart-header">Body Metrics</h4>
      <div className='chart-containers'>
        <div className="chart-container" style={{background:"var(--background-overlay)"}}>
          <div className="chart-header">Chest Circumference Chart</div>
          {chestCircumference && <ChestCircumferenceChart data={chestCircumference} />}
        </div>
        <div className="chart-container" style={{background:"var(--background-overlay)"}}>
          <div className="chart-header">Waist Circumference Chart</div>
          {waistCircumference && <WaistCircumferenceChart data={waistCircumference} />}
        </div>
        <div className="chart-container" style={{background:"var(--background-overlay)"}}>
          <div className="chart-header">Hip Circumference Chart</div>
          {hipCircumference && <HipCircumferenceChart data={hipCircumference} />}
        </div>
    </div>
    <div className="other-results-container">
      <div>
        <h4 className='chart-header'>BMI</h4>
        <div className={bmi < 18.5 ? "under-weight": 
        bmi > 18.5 && bmi < 24.9 ? "normal-weight" : 
        bmi > 25 && bmi < 29.9 ? "over-weight" :
        bmi > 40 ? "obese" : ""}>{bmi.toFixed(2)}</div>
        <br/>
        <div className='bmi-key'> 
          <h6>Color key:</h6>
          <div className='bmi-text-box'><div className='under-weight-box'></div>Underweight</div>
          <div className='bmi-text-box'><div className='normal-weight-box'></div>Normal weight</div>
          <div className='bmi-text-box'><div className='over-weight-box'></div>Overweight</div>
          <div className='bmi-text-box'><div className='obese-box'></div>Obese</div>
        </div>
      </div>
        <div className="chart-container" style={{background:"var(--background-overlay)"}}>
          <div className="chart-header">Calories Burned</div>
          {caloriesBurned && <CaloriesBurnedChart data={caloriesBurned} />}
      </div>
    </div>
    </div>
    </div>
    </>);
};

export default Report;
