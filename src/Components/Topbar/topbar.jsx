import React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import './topbar.css'
import Grid from '@mui/material/Grid';
import {FaSignOutAlt, FaChevronCircleDown, FaRegChartBar} from 'react-icons/fa' 
import { FaPersonRunning, FaDumbbell } from "react-icons/fa6";
import { UseAppContext } from '../../Context/app-context'
import ListIcon from '@mui/icons-material/List';


const Topbar =()=>{
     const {setLoggedIn, loggedIn, setCurrentUser, currentUserParsed, openSidebar} = UseAppContext()
     const {id, firstname, lastname, fitnessLevel} = currentUserParsed
     
     
     let firstnameCapitalized = '';
     let lastnameCapitalized = ''
     if(firstname){
         firstnameCapitalized = firstname.slice(0,1).toUpperCase().concat(firstname.slice(1).toLowerCase())
     }
 
     if(lastname){
         lastnameCapitalized = lastname.slice(0,1).toUpperCase().concat(lastname.slice(1).toLowerCase())
     }
    
     const [anchorEl, setAnchorEl] = React.useState(null);
   
     const handleClick = (event) => {
       setAnchorEl(event.currentTarget);
     };
   
     const handleClose = () => {
       setAnchorEl(null);
     };
   
     const open = Boolean(anchorEl);

     const setLoginValues =(value, loginData)=>{
        setCurrentUser(loginData)
        setLoggedIn(value)
        window.location.href = '/sign-in'
    }

    return <Grid className='topbarContainer' container>
        <Grid className="topLeft" item xs ={9} sm={3} >
            <Link to='/' className='mainlogo-link'>
                <div className='mainlogo'>Home Workout & Analytics</div>
            </Link>
        </Grid>
        <Grid className="topCenter" item xs ={false} sm={5}>
            <div className="topCenter-inner">
                <ul className="topCenter-ul">
                    <Link to='/' className={window.location.pathname == '/' ? `topCenter-li-active` :`topCenter-li` }>
                        <li >
                            <FaDumbbell 
                            className= {window.location.pathname == '/' ? `top-icons-active` :`top-icons` }
                             size='25'/>
                        </li>
                    </Link>
                    <Link to={`/report/${id}`}
                    className={window.location.href.indexOf("report") > -1 ? `topCenter-li-active` :`topCenter-li` } >
                        <li >
                            <FaRegChartBar 
                            className= {window.location.href.indexOf("report") > -1 ? `top-icons-active` :`top-icons` }
                            size='25'/>
                        </li>
                    </Link>
                </ul> 
            </div>
        </Grid>
        <Grid className="" item xs ={false} sm={4}>
            <div className="topRight-inner" >
                <ul className="topRight-ul" >
                   
                    <li className='topRight-li'>
                        <FaChevronCircleDown  className="icons2" aria-describedby={id} variant="contained" color="primary" onClick={handleClick}/>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                            }}
                            transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                            }}
                        >
                        <div style={{ padding:" 1rem 0", display:"flex", flexDirection:"column", placeItems:"center"}}>
                        <Button className='link-btn'
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center", 
                        width:"100%", padding:"0.3rem 0.5rem", margin:"0"}}>
                            <Link to={`/report/${id}`} className='link'>
                                <FaRegChartBar className='nav-icon' /> <span  className='link'>My Report</span>
                            </Link>
                        </Button>
                        <Divider />
                        {loggedIn && 
                        <Button onClick={()=>setLoginValues(false, {})}  className='link-btn' 
                        style={{display:"flex", justifyContent:"flex-start", alignItems:"center",
                        width:"100%", padding:"0.3rem 0.5rem"}}>
                            <FaSignOutAlt className='link sign-out-icon' /><span  className='sign-out-btn' >Sign-out</span>
                        </Button>
                        }
                            </div>
                        </Popover>
                    </li>
                </ul>
            </div>
        </Grid>
        <div className='menu-btn-box'><ListIcon className='menu-btn' onClick = {openSidebar}/></div>
    </Grid>
}

export default Topbar
