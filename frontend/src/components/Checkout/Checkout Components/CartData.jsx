import axios from "axios";
import {server} from "../../../server"
import { toast } from "react-toastify";

const CartData = ({totalPrice, discountPercentage,  couponCode,setCouponCode, couponCodeData,  setDiscountPrice, setCouponCodeData, cart, shipping, subTotalPrice}) => {


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

  return (
    <div className="w-full lg:sticky lg:top-28 bg-surface-container-lowest rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] p-5 sm:p-7 font-jakarta">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-container">
        <h3 className="text-headline-sm text-on-surface">Order Summary</h3>
        <span className="text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant">
          {cart.length} Items
        </span>
      </div>

      {/* Cost list */}
      <div className="py-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">subtotal: </h3>
          <h5 className="text-body-lg font-semibold text-on-surface">$ {subTotalPrice}</h5>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">shipping:</h3>
          <h5 className="text-body-lg font-semibold text-on-surface">$ {shipping}</h5>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">Discount:</h3>
          <h5 className="text-body-lg font-semibold text-on-surface">
            - {
              discountPercentage ? "$" + discountPercentage.toString() : null
            }
          </h5>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 pb-6 border-t border-surface-container flex items-baseline justify-between">
        <span className="text-label-md text-on-surface-variant">Total</span>
        <h5 className="text-headline-md font-extrabold text-on-surface tracking-tight">$ {totalPrice}</h5>
      </div>

      {/* Coupon form */}
      <form onSubmit={handleSubmit} className="pt-5 border-t border-surface-container space-y-2.5">
        <label className="block text-label-md text-on-surface-variant">
          Promotional Code
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-full h-11 px-3.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="shrink-0 h-11 px-4 rounded-xl border border-primary text-primary text-label-md hover:bg-primary hover:text-on-primary transition-all duration-200"
          >
            Apply code
          </button>
        </div>
      </form>
    </div>
  )
}
export default CartData