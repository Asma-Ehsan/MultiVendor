import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../server";
import { AiOutlineCheck, AiOutlineClose, AiOutlineArrowRight } from "react-icons/ai";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error.response.data.message);
          setError(true)
        }
      };
      activationEmail();
    }
  }, []);
  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center px-margin-mobile py-8">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-surface-container shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] p-space-lg sm:p-space-xl text-center">
        {error ? (
          <>
            {/* Error state */}
            <div className="w-20 h-20 mx-auto rounded-full bg-error-container text-error flex items-center justify-center ring-8 ring-error-container/40 mb-space-lg">
              <AiOutlineClose size={36} />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Your token is expired!
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-space-sm">
              This activation link is not valid anymore. Please create your shop again to get a new one.
            </p>
            <Link to="/shop-create">
              <div className="group mt-space-lg w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary font-label-md text-label-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>Back to Shop Create</span>
                <AiOutlineArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </>
        ) : (
          <>
            {/* Success state */}
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50/60 mb-space-lg">
              <AiOutlineCheck size={36} />
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Shop account created!
            </h1>
            <p className="font-body-md text-body-md text-secondary mt-space-sm">
              Your account has been created successfully. You can log in to your shop now.
            </p>
            <Link to="/shop-login">
              <div className="group mt-space-lg w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary font-label-md text-label-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <span>Go to Shop Login</span>
                <AiOutlineArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerActivationPage;