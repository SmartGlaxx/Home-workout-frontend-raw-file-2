import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Signup, SignIn, HomePage, Workout, UserProfiling, 
  RecordHealthMetrics, WorkoutSessions, RecordBodyMetrics, Report,  
  ErrorPage,
  RiskAssessment} from './Pages/index.jsx'

function App() {
  return (
    <>
  <Router>
       <Routes>
          <Route path='/sign-up' element={<Signup/>} exact/>
          <Route path='/sign-in' element={<SignIn/>} />
          <Route path='/profiling/:id' element={<UserProfiling/>} />
          <Route path='/record-health-metrics/:id' element={<RecordHealthMetrics/>} />
          <Route path='/' element={<HomePage/>} exact/>
          <Route path='/workout/:id' element={<Workout/>} exact/>
          <Route path='/workout-session/:category' element={<WorkoutSessions/>} exact/>
          <Route path='/record-body-metrics/:id' element={<RecordBodyMetrics/>} exact/>
          <Route path='/report/:id' element={<Report/>} exact/>
          <Route path='/risk-assessment/:id' element={<RiskAssessment/>} exact/>
          
          
         <Route path='*' element={<ErrorPage/>} exact/>
       </Routes>
    </Router>
    </>
  )
}

export default App
