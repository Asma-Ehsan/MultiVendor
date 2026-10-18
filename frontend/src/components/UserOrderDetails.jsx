import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import {  useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  getImageUrl, server } from "../server";
import { getAllOrdersOfUser } from "../redux/actions/order";
import styles from "../styles/styles";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineMessage, AiOutlineStar, AiOutlineCheck } from "react-icons/ai";
import { MdOutlineLocationOn, MdOutlineCreditCard } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async(e) => {
    await axios.put(`${server}/product/create-new-review`, {
      user,
      rating,
      comment,
      productId: selectedItem._id,
      orderId: id // id means order id which it gets from params
    }, {withCredentials: true}).then((res) => {
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(null);
      setOpen(false);
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    })
  }

  const refundHandler =async () => {
    await axios.put(`${server}/order/order-refund/${id}`, {
      status: "Processing refund"
    }).then((res) => {
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    }).catch((error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    })
  }

   const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data?.cart[0]?.shop?._id;
      if (!sellerId) {
        toast.error("Seller information is unavailable");
        return;
      }
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate("/profile", {
            state: {active: 4, conversationId: res?.data?.conversation?._id},
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

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

        {/* Order status badge */}
        {data?.status === "Delivered" ? (
          <span className="inline-flex items-center gap-1.5 self-start md:self-auto px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <AiOutlineCheck size={14} />
            {data?.status}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 self-start md:self-auto px-3.5 py-1.5 rounded-full text-label-md font-label-md bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {data?.status}
          </span>
        )}
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
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-surface-container-low"
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

                    {!item.isReviewed && data?.status === "Delivered" ? (
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary transition-all duration-200 font-label-md text-label-md shadow-sm hover:shadow-md active:scale-95"
                        onClick={() => setOpen(true) || setSelectedItem(item)}
                      >
                        Write a review
                      </button>
                    ) : null}
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

        {/* RIGHT: summary + actions */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-6 space-y-5 lg:sticky lg:top-44">
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

            <button
              type="button"
              onClick={handleMessageSubmit}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <AiOutlineMessage size={18} />
              <span>Send Message</span>
            </button>

            {data?.status === "Delivered" && (
              <button
                type="button"
                onClick={refundHandler}
                className="w-full py-3 rounded-xl border border-error/30 text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md transition-all duration-200 active:scale-95"
              >
                Give a Refund
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review popup */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container">
            {/* Popup header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-container">
              <h2 className="text-headline-sm font-headline-sm text-on-surface">
                Give a Review
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low hover:text-on-surface transition-colors"
              >
                <RxCross1 size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product preview */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-container-low">
                <img
                  src={getImageUrl(selectedItem?.images?.[0])}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover bg-surface-container shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-body-md font-body-md font-semibold text-on-surface line-clamp-2">
                    {selectedItem?.name}
                  </div>
                  <h4 className="text-body-md font-body-md text-secondary">
                    US$ {selectedItem?.discountPrice} x {selectedItem?.qty}
                  </h4>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h5 className="text-label-md font-label-md text-on-surface mb-2">
                  Give a Rating <span className="text-error">*</span>
                </h5>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) =>
                    rating >= i ? (
                      <AiFillStar
                        key={i}
                        className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                        size={28}
                        onClick={() => setRating(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        key={i}
                        className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                        size={28}
                        onClick={() => setRating(i)}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-label-md font-label-md text-on-surface mb-2"
                >
                  Write a comment{" "}
                  <span className="font-normal text-secondary">(optional)</span>
                </label>
                <textarea
                  name="comment"
                  id="comment"
                  rows={5}
                  placeholder="How was your Product? write your experience about it...."
                  className="w-full p-3 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                onClick={rating > 1 ? reviewHandler : null}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
