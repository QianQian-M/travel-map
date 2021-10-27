import React from 'react';
import { useState, useRef } from 'react';
import './login.css';
import RoomIcon from '@mui/icons-material/Room';
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';

export default function Login({setShowLogin, myStorage, setCurrentUser}) {

  
  const [error,setError] = useState(false);
  const nameRef = useRef()
  const passwordRef=useRef()


  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newUser ={
      username:nameRef.current.value,
      password:passwordRef.current.value
    };

    try {
      const res = await axios.post("/users/login",newUser);
      myStorage.setItem("user",res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false)
    } catch (error) {
      setError(true)
    }
  }
  return (
    <div>
      
      <div className="loginContainer">
        <div className="logo">
          <RoomIcon /> Location
        </div>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref = {nameRef}></input>
            <input type="password" placeholder="password" ref={passwordRef}></input>
            <button className="loginButton">Login</button>
           
            {error && <span className="failure">Failed</span>}
            
          </form>

          <CancelIcon className="loginCancel" onClick={()=>setShowLogin(false)} />
      </div>

    </div>
  )
}
