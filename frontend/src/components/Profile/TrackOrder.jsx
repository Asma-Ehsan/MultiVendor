import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { MdLocalShipping } from "react-icons/md";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

    return (
    <div className="max-w-[1320px] mx-auto w-full min-h-[70vh] px-margin-mobile lg:px-margin py-8 flex items-center justify-center">
      {data && (
        <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
            <MdLocalShipping size={32} />
          </div>

          {/* Small label */}
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Order Status
          </span>

          {/* Status badge */}
          <div className="mt-3 mb-4">
            {data?.status === "Delivered" || data?.status === "Refund Success" ? (
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                {data?.status}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-amber-50 text-amber-700 border border-amber-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {data?.status}
              </span>
            )}
          </div>

          {/* Message (same conditions as before) */}
          <h1 className="text-headline-sm font-headline-sm text-on-surface leading-relaxed">
            {data?.status === "Processing"
              ? "Your Order is processing in shop."
              : data?.status === "Transferred to delivery partner"
              ? "Your Order is on the way for delivery partner."
              : data?.status === "Shipping"
              ? "Your Order is coming with our delivery partner."
              : data?.status === "Received"
              ? "Your Order is in your city. Our delivery man will deliver it."
              : data?.status === "On the way"
              ? "Our delivery man is going to deliver your order."
              : data?.status === "Delivered"
              ? "Your order is delivered!"
              : data?.status === "Processing refund"
              ? "Your refund is Processing!"
              : data?.status === "Refund Success"
              ? "Your refund is success!"
              : null}
          </h1>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;