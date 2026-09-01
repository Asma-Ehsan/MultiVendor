import CartData from "./Checkout Components/CartData";
import ShippingInfo from "./Checkout Components/ShippingInfo";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null)
  const navigate = useNavigate();

   const subTotalPrice = cart.reduce((acc,item) => acc + item.qty * item.discountPrice, 0);
  const shipping = subTotalPrice * 0.1;
    const discountPercentage = couponCodeData ? discountPrice : "";
    const totalPrice = couponCodeData ? (subTotalPrice + shipping - discountPercentage).toFixed(2) : (subTotalPrice + shipping).toFixed(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
      toast.error("Please choose your delivery address!")
    }else{
      const shippingAddress = {
      address1, 
      address2,
      zipCode,
      country,
      city,
    }
    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress,
      user,
    }

    //update local storage with updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            totalPrice={totalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
            couponCodeData = {couponCodeData}
            setDiscountPrice = {setDiscountPrice}
            setCouponCodeData = {setCouponCodeData}
            cart = {cart}
            subTotalPrice = {subTotalPrice}
            shipping = {shipping}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

export default Checkout;
