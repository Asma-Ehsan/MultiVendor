import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import UserOrderDetails from "../components/UserOrderDetails"
import { useEffect } from 'react'

const OrderDetailsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  return (
    <div className="min-h-screen bg-background">
        <Header/>
        <UserOrderDetails/>
        <Footer/>
    </div>
  )
}

export default OrderDetailsPage