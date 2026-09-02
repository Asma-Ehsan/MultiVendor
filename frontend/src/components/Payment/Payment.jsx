import { useEffect, useState } from "react";
import CartData from "./CartData/CartData";
import PaymentInfo from "./PaymentInfo/PaymentInfo";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  },[]);
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData = {orderData} />
        </div>
      </div>
    </div>
  );
};

export default Payment;
