import { IoCheckmarkCircleOutline } from "react-icons/io5";

const CartData = ({orderData}) => {
    const shipping = orderData?.shipping?.toFixed(2);
return (
    <div className="w-full lg:sticky lg:top-28 bg-surface-container-lowest rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)] p-5 sm:p-7 font-jakarta">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-container">
        <h3 className="text-headline-sm text-on-surface">Order Summary</h3>
        <span className="text-label-sm px-2.5 py-1 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant">
          {orderData?.cart?.length} Items
        </span>
      </div>

      {/* Cost list */}
      <div className="py-4 space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">subtotal:</h3>
          <h5 className="text-body-lg font-semibold text-on-surface">${orderData?.subTotalPrice}</h5>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">shipping:</h3>
          <h5 className="text-body-lg font-semibold text-on-surface">${shipping}</h5>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-body-md text-secondary capitalize">Discount:</h3>
          <h5 className="text-body-lg font-semibold text-on-surface">{orderData?.discountPrice? "$" + orderData.discountPrice : "-"}</h5>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-surface-container flex items-baseline justify-between">
        <span className="text-label-md text-on-surface-variant">Total</span>
        <h5 className="text-headline-md font-extrabold text-on-surface tracking-tight">
          ${orderData?.totalPrice}
        </h5>
      </div>
    </div>
  );
}

export default CartData