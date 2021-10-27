import React from 'react';
import { useState, useRef } from 'react';
import './register.css';
import RoomIcon from '@mui/icons-material/Room';
import axios from "axios";
import CancelIcon from '@mui/icons-material/Cancel';

export default function Register({setShowRegister}) {

  const [success, setSuccess] = useState(false);
  const [error,setError] = useState(false);
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef=useRef()


  const handleSubmit = async (e) =>{
    e.preventDefault();
    const newUser ={
      username:nameRef.current.value,
      email:emailRef.current.value,
      password:passwordRef.current.value
    };

    try {
      await axios.post("/users/register",newUser);
      setError(false)
      setSuccess(true)
    } catch (error) {
      setError(true)
    }
  }
  return (
    <div>
      
      <div className="registerContainer">
        <div className="logo">
          <RoomIcon /> Location
        </div>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="username" ref = {nameRef}></input>
            <input type="email" placeholder="email" ref={emailRef}></input>
            <input type="password" placeholder="password" ref={passwordRef}></input>
            <button className="registerButton">Register</button>
            {success && (
              <span className="success">Sucessfull</span>
            )}
            {error && <span className="failure">Failed</span>}
            
          </form>

          <CancelIcon className="registerCancel" onClick={()=>setShowRegister(false)} />
      </div>

    </div>
  )
}
