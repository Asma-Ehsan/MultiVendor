import styles from '../../../styles/styles'
import axios from "axios";
import {server} from "../../../server"
import { toast } from "react-toastify";
import { useState } from 'react';

const CartData = ({couponCode,setCouponCode, couponCodeData, setCouponCodeData, cart}) => {

  const [discountPrice, setDiscountPrice] = useState(null)
  const subTotalPrice = cart.reduce((acc,item) => acc + item.qty * item.discountPrice, 0);
  
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;
    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if(res.data.couponCode !== null){
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);
       if(isCouponValid.length === 0) {
        toast.error("Coupon code is not valid for this shop!");
       }else{
        const eligiblePrice = isCouponValid.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);
        const discountPrice = ((eligiblePrice * couponCodeValue / 100));
        setDiscountPrice(discountPrice);
        setCouponCodeData(res.data.couponCode);
        setCouponCode("");
       }
      }
      if(res.data.couponCode === null){
        toast.error("Coupon code does not exists!");
        setCouponCode("");
      }
    })
  }

  const discountPercentage = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData ? (subTotalPrice + shipping - discountPercentage).toFixed(2) : (subTotalPrice + shipping).toFixed(2);

  return (
     <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal: </h3>
        <h5 className="text-[18px] font-[600]">$ {subTotalPrice}</h5>
      </div>
      {console.log({shipping,subTotalPrice })}
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">$ {shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          - {
            discountPercentage ? "$" + discountPercentage.toString() : null
          }
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">$ {totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  )
}

export default CartData