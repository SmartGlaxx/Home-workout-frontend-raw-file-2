import { useEffect } from 'react'
import { UseAppContext } from '../../Context/app-context'
import {Topbar, Sidebar, Backdrop} from '../../Components';
import 'bootstrap/dist/css/bootstrap.min.css';
import './homepage.css'
import { Link } from 'react-router-dom';
import { WorkoutData } from '../../Resources/data';


const HomePage =()=>{
    const {currentUserParsed, loggedIn} = UseAppContext()
    const {exercises} = WorkoutData
    const {fitnessLevel} = currentUserParsed
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    if(loggedIn == "false" || !loggedIn){
        return window.location.href = `/sign-in`
    }
    
    return<>
    <Topbar />
    <Sidebar />
    <Backdrop />
    <div className='homepage'> 
        <h2 >WORKOUTS</h2>
        <div className='workout-category'>
        <div className='workout-title-container'>
        <h5>Beginner Workouts <span className='recommedation'>{fitnessLevel=="beginner" ? " (Recommended)" : ""}</span></h5>
        <Link to={`/workout-session/beginner`}><button className={fitnessLevel == "beginner" ? 'start-button-recommended': 'start-button'}>
                Start Workout
            </button></Link>
        </div>
        
            <div className='workouts'>
            {
            exercises
                .filter(exercise => exercise.category === "Beginner")
                .map(exercise => (
                <div key={exercise.id}>
                    <Link to={`/workout/${exercise.id}`} className='workout-item'>
                    <h6>{exercise.name}</h6>
                    <div>{exercise.category}</div>
                    <img className="workout-image" src={exercise.image} alt={exercise.name} />
                    </Link>
                </div>
                ))
            } 
            </div>
            </div>
            
            <hr />

            <div className='workout-category'>
            <div className='workout-title-container'>
            <h5>Intermediate Workouts <span className='recommedation'>{fitnessLevel=="intermediate" ? " (Recommended)" : ""}</span></h5>
            <Link to={`/workout-session/intermediate`}><button className={fitnessLevel == "intermediate" ? 'start-button-recommended': 'start-button'}>
                Start Workout</button></Link>
            </div>
            <div className='workouts'>
            {
            exercises
                .filter(exercise => exercise.category === "Intermediate")
                .map(exercise => (
                <div key={exercise.id}>
                    <Link to={`/workout/${exercise.id}`} className='workout-item'>
                    <h6>{exercise.name}</h6>
                    <div>{exercise.category}</div>
                    <img className="workout-image" src={exercise.image} alt={exercise.name} />
                    </Link>
                </div>
                ))
            }
            </div>
            </div> 
            
            <hr />
            
            <div className='workout-category'>
            <div className='workout-title-container'>
            <h5>Advanced Workouts <span className='recommedation'>{fitnessLevel=="advanced" ? " (Recommended)" : ""}</span></h5>
            <Link to={`/workout-session/advanced`}><button className={fitnessLevel == "advanced" ? 'start-button-recommended': 'start-button'}>
                Start Workout</button></Link>
            </div>
            <div className='workouts'>
            {
            exercises
                .filter(exercise => exercise.category === "Advanced")
                .map(exercise => (
                <div key={exercise.id}>
                    <Link to={`/workout/${exercise.id}`} className='workout-item'>
                        <h6>{exercise.name}</h6>
                        <div>{exercise.category}</div>
                        <img className="workout-image" src={exercise.image} alt={exercise.name} />
                    </Link>
                </div>
                ))
            }
            </div>
            </div>   
    </div>
    </>
}

export default HomePage
