import React, { useEffect } from 'react'
import ShopLogin from "../components/Shop/ShopLogin.jsx"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const {isSeller, isLoading} = useSelector((state) => state.seller);

  // Watching `isLoading` means: when the seller check finishes, run the logic again and make a fresh decision.
  useEffect(() => {
    if(isSeller === true){
      navigate("/dashboard")
    }
  },[isLoading, isSeller])
  return (
    <div>
      <ShopLogin/>
    </div>
  )
}

export default ShopLoginPage
