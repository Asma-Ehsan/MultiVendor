import React, { useEffect } from 'react'
import Signup from "../components/Signup/Signup.jsx"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SignupPage = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state) => state.user);

  /*A user is already logged in (maybe from yesterday — the cookie is still valid). If they type /login in the URL bar directly, or click a stale "Login" link, it makes no sense to show them the login form again — they're already logged in! We want to redirect them away automatically.*/
  
  useEffect(() => {
    if(isAuthenticated === true){
      navigate("/")
    }
  },[isAuthenticated])
  return (
    <div>
      <Signup/>
    </div>
  )
}

export default SignupPage