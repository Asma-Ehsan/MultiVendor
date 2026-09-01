import styles from "../../styles/styles";
const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] 800px:w-[50%] flex items-center flex-wrap ">
        {/* Shipping element */}
        <div className={`${styles.noramlFlex}`}>
          {/* Shipping button */}
          <div className={`${styles.cart_button}`}>
            <span className={`${styles.cart_button_text}`}>1. Shipping</span>
          </div>
          {/* Connecting line of shipping and payment */}
          <div
            className={`${active > 1 ? "w-[30px] 800px:[70px] h-[4px] !bg-[#f63b60] " : "w-[30px] 800px:[70px] h-[4px] !bg-[#FDE1E6] "}`}
          />
        </div>

        {/* Payment */}
        <div className={`${styles.noramlFlex}`}>
          {/* Payment button */}
          <div
            className={`${active > 1 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#FDE1E6]`}`}
          >
            <span
              className={`${active > 1 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#f63b60]`}`}
            >
              2.Payment
            </span>
          </div>
          {/* Connecting line of Payment and Success */}
          <div
            className={`${active > 2 ? "w-[30px] 800px:[70px] h-[4px] !bg-[#f63b60] " : "w-[30px] 800px:[70px] h-[4px] !bg-[#FDE1E6] "}`}
          />
        </div>

        {/* Success */}
        <div className={`${styles.noramlFlex}`}>
          {/* Connecting line of Payment and Success */}
          <div
            className={`${
              active > 2
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
            }`}
          />
          {/* Success button */}
          <div
            className={`${active > 2 ? `${styles.cart_button}` : `${styles.cart_button} !bg-[#FDE1E6]`}`}
          >
            <span
              className={`${active > 2 ? `${styles.cart_button_text}` : `${styles.cart_button_text} !text-[#f63b60]`}`}
            >
              3.Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
