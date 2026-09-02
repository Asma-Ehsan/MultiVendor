import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/styles";

const PaymentInfo = () => {
  const [select, setSelect] = useState(1);
  const navigate = useNavigate();

  const paymentHandler = (e) => {
    e.preventDefault();
    navigate("/order/success/fdbxf9848");
  };
  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* Select Buttons */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Pay with Debit/credit card
          </h4>
        </div>

        {/* pay with card */}
        {select === 1 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="flex w-full pb-3 gap-3">
                {/* Card Number */}
                <div className="w-[50%]">
                  <label className="block pb-2">Card Number</label>
                  <input required className={`${styles.input}`} />
                </div>
                {/* Expire date */}
                 <div className="w-[50%]">
                  <label className="block pb-2">Exp Date</label>
                  <input required className={`${styles.input}`} />
                </div>
              </div>

              <div className="flex w-full pb-3 gap-3">
                {/* Name on Card */}
                <div className="w-[50%]">
                  <label className="block pb-2">Name on Card</label>
                  <input required className={`${styles.input}`} />
                </div>
                {/* Billing Address */}
                <div className="w-[50%]">
                  <label className="block pb-2">Billing Address</label>
                  <input required className={`${styles.input}`} />
                </div>
              </div>

              <input
                type="submit"
                value="Submit"
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>

      <br />
      {/* paypal payment */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
           Pay with Paypal
          </h4>
        </div>

       {select === 2 ? (
          <div className="w-full flex border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="flex w-full pb-3">
                <div className="w-full">
                  <label className="block pb-2">Paypal Email</label>
                  <input required className={`${styles.input}`} />
                </div>
              </div>

              <input
                type="submit"
                value="Submit"
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>

       <br />
      {/* cash on delivery */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
            onClick={() => setSelect(3)}
          >
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>
                {select === 3 ? (
          <div className="w-full flex">
            <form className="w-full"
            //  onSubmit={cashOnDeliveryHandler}
             >
              <input
                type="submit"
                value="Confirm"
                className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
              />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentInfo;
