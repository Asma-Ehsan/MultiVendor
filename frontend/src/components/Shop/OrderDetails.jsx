import { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { backend_url, getImageUrl, server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineCreditCard, MdOutlineLocationOn } from "react-icons/md";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async (e) => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order Updated!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async (e) => {
     await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Order Updated!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const selectStyle =
  "w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

  return (
  <div className="max-w-[1320px] mx-auto w-full min-h-screen px-margin-mobile lg:px-margin py-8 lg:py-12 space-y-6">
    {/* Top card: title, order id, date, status */}
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
          <BsFillBagFill size={22} />
        </div>
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface tracking-tight">
            Order Details
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-body-md font-body-md text-secondary">
            <span>
              Order ID:{" "}
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md">
                #{data?._id?.slice(0, 8)}
              </span>
            </span>
            <span className="text-outline-variant">•</span>
            <span>
              Placed on:{" "}
              <span className="text-on-surface font-medium">
                {data?.createdAt?.slice(0, 10)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Status badge + Order List button */}
      <div className="flex flex-wrap items-center gap-3">
        {data?.status === "Delivered" || data?.status === "Refund Success" ? (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <AiOutlineCheck size={14} />
            {data?.status}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {data?.status}
          </span>
        )}

        <Link to="/dashboard-orders">
          <div className="px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-primary-fixed hover:text-primary border border-surface-variant/40 font-label-md text-label-md transition-all duration-200">
            Order List
          </div>
        </Link>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: items, shipping, payment */}
      <div className="lg:col-span-8 space-y-6">
        {/* Ordered items */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6">
          <h2 className="text-headline-sm font-headline-sm text-on-surface mb-4">
            Ordered Items ({data?.cart?.length})
          </h2>

          <div className="space-y-3">
            {data &&
              data?.cart?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors duration-200"
                >
                  <img
                    src={getImageUrl(item?.images?.[0])}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover bg-surface-container shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-headline-sm font-headline-sm text-on-surface line-clamp-2">
                      {item.name}
                    </h5>
                    <h5 className="text-body-md font-body-md text-secondary mt-1">
                      US$ {item.discountPrice} x {item.qty}
                    </h5>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Shipping + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping address */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-on-surface">
              <MdOutlineLocationOn size={22} className="text-primary" />
              <h3 className="text-headline-sm font-headline-sm">Shipping Address</h3>
            </div>
            <div className="space-y-1 text-body-md font-body-md">
              <h4 className="text-on-surface font-semibold">
                {data?.shippingAddress.address1 +
                  " " +
                  data?.shippingAddress.address2}{" "}
              </h4>
              <h4 className="text-secondary">{data?.shippingAddress.country}</h4>
              <h4 className="text-secondary">{data?.shippingAddress.city}</h4>
              <h4 className="text-secondary">{data?.user?.phoneNumber}</h4>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-on-surface">
              <MdOutlineCreditCard size={22} className="text-primary" />
              <h3 className="text-headline-sm font-headline-sm">Payment Info</h3>
            </div>
            <div className="flex items-center justify-between text-body-md font-body-md">
              <span className="text-secondary">Status:</span>
              {data?.paymentInfo?.status ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-md text-label-md">
                  <AiOutlineCheck size={12} />
                  {data?.paymentInfo?.status}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-label-md text-label-md">
                  Not Paid
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: summary + update status */}
      <div className="lg:col-span-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6 space-y-5 lg:sticky lg:top-24">
          <h3 className="text-headline-sm font-headline-sm text-on-surface">
            Order Summary
          </h3>

          <div className="flex items-center justify-between text-body-md font-body-md text-secondary">
            <span>Items</span>
            <span className="text-on-surface font-medium">{data?.cart?.length}</span>
          </div>

          <div className="border-t border-surface-container pt-4 flex items-baseline justify-between">
            <span className="text-headline-sm font-headline-sm text-on-surface">
              Total Price
            </span>
            <strong className="text-price-lg font-price-lg text-on-surface">
              US$ {data?.totalPrice}
            </strong>
          </div>

          {/* Order status controls */}
          <div className="border-t border-surface-container pt-4 space-y-space-sm">
            <h4 className="font-label-md text-label-md text-on-surface">Order Status</h4>

            {(data?.status !== "Processing refund" && data?.status !== "Refund Success") && (
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectStyle}
              >
                {[
                  "Processing",
                  "Transferred to delivery partner",
                  "Shipping",
                  "Received",
                  "On the way",
                  "Delivered",
                ]
                  .slice(
                    [
                      "Processing",
                      "Transferred to delivery partner",
                      "Shipping",
                      "Received",
                      "On the way",
                      "Delivered",
                    ].indexOf(data?.status),
                  )
                  .map((option, index) => (
                    <option value={option} key={index}>
                      {option}
                    </option>
                  ))}
              </select>
            )}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={selectStyle}
            >
              {["Processing refund", "Refund Success"]
                .slice(["Processing refund", "Refund Success"].indexOf(data?.status))
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))}
            </select>

            <button
              type="button"
              onClick={data?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderDetails;
