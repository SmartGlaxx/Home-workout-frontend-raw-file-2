import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css'
import {FaSignOutAlt, FaWindowClose, FaRegChartBar} from 'react-icons/fa' 
import { FaPersonRunning, FaDumbbell } from "react-icons/fa6";
import { UseAppContext } from '../../Context/app-context'


const Sidebar =()=>{
    const {setLoggedIn, loggedIn, currentUserParsed, sidebarOpen, openSidebar,
         setCurrentUser} = UseAppContext()
    const [showDropdown, setShowDropdown] = useState(false)
    const [showDropdown2, setShowDropdown2] = useState(false)


const {id, firstname, lastname, fitnessLevel} = currentUserParsed
   
     let firstnameCapitalized = '';
     let lastnameCapitalized = ''
     if(firstname){
         firstnameCapitalized = firstname.slice(0,1).toUpperCase().concat(firstname.slice(1).toLowerCase())
     }
 
     if(lastname){
         lastnameCapitalized = lastname.slice(0,1).toUpperCase().concat(lastname.slice(1).toLowerCase())
     }
const setCloseDropdown = ()=>{
    if(showDropdown || showDropdown2){
        setShowDropdown(false)
        setShowDropdown2(false)
    }
}

const setLoginValues =(value, loginData)=>{
    setCurrentUser(loginData)
    setLoggedIn(value)
    window.location.href = '/sign-in'
}

     
    return <div className={ sidebarOpen ? `sidebarContainer2` : `sidebarContainer1`} onClick={()=>{setCloseDropdown(true)}} >
        <div className="sidebarTop " xs ={9} sm={3}>
             <div className='sidebarlogo' onClick={openSidebar}>
                <Link to='/' className='mainlogo-link'>
                    <div className='mainlogo'>Home Workout <br />& Analytics</div>
                </Link>
             </div>
            <FaWindowClose className='close-icon' size='25' onClick = {openSidebar}/>
        </div>
        <div className="sideTop" >
            <div className="sideTop-inner">
                <ul className="sideTop-ul">
                     
                    <li className="sideTop-li" onClick={openSidebar}>
                    <Link to='/' className='left-nav'>
                    <div className= {window.location.pathname == '/' ? `sideTop-li-inner-active` :`sideTop-li-inner` }>
                    <FaDumbbell className= {window.location.pathname == '/'? `icons-active` :`icons`}  size='15'/>
                         Workouts </div>
                    </Link>
                    </li>
                    <li className="sideTop-li" onClick={openSidebar}>
                    <Link to={`/report/${id}`} className='left-nav' >
                    <div className= {window.location.href.indexOf("report") > -1 ? `sideTop-li-inner-active` :`sideTop-li-inner ` }>
                    <FaRegChartBar className= {window.location.href.indexOf("report") > -1 ? `icons-active` :`icons`} size='15'/>
                        My Report </div>
                    </Link>
                    </li>
                </ul> 
            </div>
        </div>

        <div className="sideBottom">
            <div className="sideBottom-inner" >
                <ul className="">
                    {loggedIn && <>
                        <li onClick={()=>setLoginValues(false, {})}  className='sideTop-li sign-out' 
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0rem"}}>
                            <FaSignOutAlt className="sign-out-icon" size='15'/><span  className='sign-out-btn' >Sign-out</span>
                        </li>
                    </>}
                </ul>
            </div>
        </div> 
        
    </div>
}

export default Sidebar
