const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center px-4 font-jakarta">
      <div className="w-full max-w-2xl flex items-center">
        {/* Step 1: Shipping (always colored) */}
        <div className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-transparent text-label-md text-on-primary bg-gradient-to-r from-primary to-primary-container shadow-md ring-2 sm:ring-4 ring-primary-fixed">
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-label-sm">
            1
          </span>
          {/* On phones, show the word only for the current step */}
          <span className={active === 1 ? "inline" : "hidden sm:inline"}>
            Shipping
          </span>
          {active === 1 && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          )}
        </div>

        {/* Line between Shipping and Payment */}
        <div
          className={`flex-1 min-w-[12px] h-0.5 mx-1.5 sm:mx-2 rounded-full transition-colors duration-300 ${
            active > 1 ? "bg-primary" : "bg-outline-variant/50"
          }`}
        ></div>

        {/* Step 2: Payment */}
        <div
          className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-label-md transition-all duration-300 ${
            active > 1
              ? "border-transparent text-on-primary bg-gradient-to-r from-primary to-primary-container shadow-md ring-2 sm:ring-4 ring-primary-fixed"
              : "border-outline-variant/60 text-secondary bg-surface-container-lowest shadow-sm"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-label-sm ${
              active > 1
                ? "bg-white/20"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            2
          </span>
          <span className={active === 2 ? "inline" : "hidden sm:inline"}>
            Payment
          </span>
          {active === 2 && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          )}
        </div>

        {/* Line between Payment and Success */}
        <div
          className={`flex-1 min-w-[12px] h-0.5 mx-1.5 sm:mx-2 rounded-full transition-colors duration-300 ${
            active > 2 ? "bg-primary" : "bg-outline-variant/50"
          }`}
        ></div>

        {/* Step 3: Success */}
        <div
          className={`shrink-0 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border text-label-md transition-all duration-300 ${
            active > 2
              ? "border-transparent text-on-primary bg-gradient-to-r from-primary to-primary-container shadow-md ring-2 sm:ring-4 ring-primary-fixed"
              : "border-outline-variant/60 text-secondary bg-surface-container-lowest shadow-sm"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-label-sm ${
              active > 2
                ? "bg-white/20"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            3
          </span>
          <span className={active === 3 ? "inline" : "hidden sm:inline"}>
            Success
          </span>
          {active === 3 && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;