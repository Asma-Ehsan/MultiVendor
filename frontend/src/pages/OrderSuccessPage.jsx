import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const OrderSuccessPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <br />
      <br />
      <div className="flex-grow">
        <Success />
      </div>
      <Footer />
    </div>
  );
};

const Success = () => {
    const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-center px-4 py-10 lg:py-16 font-jakarta">
      <div className="relative w-full max-w-lg overflow-hidden bg-surface-container-lowest rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] px-6 py-10 sm:px-12 sm:py-14 text-center">
        {/* soft color circles in the background */}
        <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-tertiary-fixed/40 blur-3xl pointer-events-none"></div>

        {/* Animated tick */}
        <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
          {/* soft ring that pulses 3 times */}
          <span
            className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
            style={{ animationIterationCount: 3 }}
          ></span>
          <svg viewBox="0 0 100 100" className="relative w-28 h-28">
            {/* circle grows from the center */}
            <circle cx="50" cy="50" r="0" className="fill-primary">
              <animate
                attributeName="r"
                from="0"
                to="44"
                dur="0.5s"
                begin="0s"
                fill="freeze"
                calcMode="spline"
                keyTimes="0;1"
                keySplines="0.34 1.56 0.64 1"
              />
            </circle>
            {/* tick is drawn like a pen stroke */}
            <path
              d="M30 52 L45 66 L71 36"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="62"
              strokeDashoffset="62"
              className="stroke-white"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="62"
                to="0"
                dur="0.45s"
                begin="0.45s"
                fill="freeze"
              />
            </path>
          </svg>
        </div>

        <h5 className="relative mt-8 text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
          Your order is successful
        </h5>
        <p className="relative mt-2 text-body-md text-secondary max-w-sm mx-auto">
          Thank you for shopping on ShopNest. We have received your order and
          will keep you updated.
        </p>

        {/* Buttons */}
        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-md shadow-md hover:shadow-lg transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;