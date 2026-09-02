import Header from '../components/Layout/Header'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Footer from '../components/Layout/Footer'
import Payment from "../components/Payment/Payment"
import { useEffect } from 'react'

const PaymentPage = () => {
  useEffect(() => {
    window.scrollTo(0,0);
  },[]);
  
  return (
    <div>
        <Header/>
        <br />
        <br />
        <CheckoutSteps active = {2}/>
        <Payment/>
        <br />
        <br />
        <Footer/>
    </div>
  )
}

export default PaymentPage