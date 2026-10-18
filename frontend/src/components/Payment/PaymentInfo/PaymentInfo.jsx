import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { RxCross1 } from "react-icons/rx";
import { IoCardOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const labelClass = "block text-label-md text-on-surface-variant mb-1.5";
const inputClass =
  "w-full h-11 px-3.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

const stripeClass =
  "w-full h-11 px-3.5 py-2.5 bg-surface-container-low hover:bg-surface-container rounded-xl border border-surface-container-high transition-all duration-200";
const primaryButtonClass =
  "group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-md shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-300 cursor-pointer";

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="w-full bg-surface-container-lowest rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] p-5 sm:p-8 font-jakarta">
      {/* Section title */}
      <div className="border-b border-surface-container pb-5 mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
            <IoCardOutline size={22} />
          </div>
          <div>
            <h5 className="text-headline-sm text-on-surface tracking-tight">
              Payment Method
            </h5>
            <p className="text-body-sm text-secondary mt-0.5">
              Select your preferred payment method and enter your details.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 shrink-0 text-label-sm px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Step 2 of 3
        </span>
      </div>

      <div className="space-y-4">
        {/* ---------- Option 1: Card ---------- */}
        <div
          className={`rounded-2xl p-5 transition-all duration-200 ${
            select === 1
              ? "border-2 border-primary bg-primary-fixed/20"
              : "border-2 border-surface-container hover:border-primary-fixed"
          }`}
        >
          {/* Select button */}
          <div
            className="flex items-center justify-between gap-3 cursor-pointer"
            onClick={() => setSelect(1)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  select === 1 ? "border-primary" : "border-outline"
                }`}
              >
                {select === 1 ? (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                ) : null}
              </div>
              <h4 className="text-label-md sm:text-body-lg font-semibold text-on-surface">
                Pay with Debit/credit card
              </h4>
            </div>
            {/* Card brand badges */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 rounded border border-blue-200">
                VISA
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-red-600 bg-red-100 rounded border border-red-200">
                MASTERCARD
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-100 rounded border border-sky-200">
                AMEX
              </span>
            </div>
          </div>

          {/* pay with card */}
          {select === 1 ? (
            <div className="w-full mt-5 pt-5 border-t border-primary-fixed/70">
              <form
                className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4"
                onSubmit={paymentHandler}
              >
                {/* Name on Card */}
                <div>
                  <label className={labelClass}>Name on Card</label>
                  <input
                    required
                    placeholder={user && user.name}
                    className={`${inputClass} text-[#444]`}
                    value={user && user.name}
                  />
                </div>
                {/* Expire date */}
                <div>
                  <label className={labelClass}>Exp Date</label>
                  <CardExpiryElement
                    className={stripeClass}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className={labelClass}>Card Number</label>
                  <CardNumberElement
                    className={stripeClass}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
                {/* CVV */}
                <div>
                  <label className={labelClass}>CVV</label>
                  <CardCvcElement
                    className={stripeClass}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button type="submit" className={primaryButtonClass}>
                    <span>Submit</span>
                    <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>

        {/* ---------- Option 2: PayPal ---------- */}
        <div
          className={`rounded-2xl p-5 transition-all duration-200 ${
            select === 2
              ? "border-2 border-primary bg-primary-fixed/20"
              : "border-2 border-surface-container hover:border-primary-fixed"
          }`}
        >
          {/* Select button */}
          <div
            className="flex items-center justify-between gap-3 cursor-pointer"
            onClick={() => setSelect(2)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  select === 2 ? "border-primary" : "border-outline"
                }`}
              >
                {select === 2 ? (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                ) : null}
              </div>
              <h4 className="text-label-md sm:text-body-lg font-semibold text-on-surface">
                Pay with Paypal
              </h4>
            </div>
            <span className="text-blue-600 font-black italic text-body-md tracking-tight">
              <span className="text-blue-800">Pay</span>Pal
            </span>
          </div>

          {select === 2 ? (
            <div className="w-full mt-5 pt-5 border-t border-primary-fixed/70 flex">
              <div className={primaryButtonClass} onClick={() => setOpen(true)}>
                {" "}
                Pay Now!{" "}
              </div>
              {open && (
                <div className="w-full fixed top-0 left-0 bg-inverse-surface/40 backdrop-blur-sm h-screen flex items-center justify-center z-[999999] ">
                  <div className="w-full sm:max-w-md h-screen sm:h-auto sm:max-h-[80vh] bg-surface-container-lowest sm:rounded-3xl shadow-2xl flex flex-col justify-center p-8 relative overflow-y-auto">
                    <RxCross1
                      size={24}
                      className="cursor-pointer absolute top-4 right-4 text-secondary hover:text-on-surface transition-colors"
                      onClick={() => setOpen(false)}
                    />
                    {/* loads PayPal's code in the browser, using your Client ID. */}
                    <PayPalScriptProvider
                      options={{
                        "client-id":
                          "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn",
                      }}
                    >
                      <PayPalButtons
                        style={{ layout: "vertical" }}
                        onApprove={onApprove}
                        createOrder={createOrder}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* ---------- Option 3: Cash on delivery ---------- */}
        <div
          className={`rounded-2xl p-5 transition-all duration-200 ${
            select === 3
              ? "border-2 border-primary bg-primary-fixed/20"
              : "border-2 border-surface-container hover:border-primary-fixed"
          }`}
        >
          {/* Select button */}
          <div
            className="flex items-center justify-between gap-3 cursor-pointer"
            onClick={() => setSelect(3)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  select === 3 ? "border-primary" : "border-outline"
                }`}
              >
                {select === 3 ? (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                ) : null}
              </div>
              <h4 className="text-label-md sm:text-body-lg font-semibold text-on-surface">
                Cash on Delivery
              </h4>
            </div>
          </div>

          {select === 3 ? (
            <div className="w-full mt-5 pt-5 border-t border-primary-fixed/70 flex">
              <form className="w-full" onSubmit={cashOnDeliveryHandler}>
                <button type="submit" className={primaryButtonClass}>
                  <span>Confirm</span>
                  <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;