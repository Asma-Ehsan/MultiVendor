import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../server";
import { getAllOrdersOfUser } from "../redux/actions/order";
import styles from "../styles/styles";


const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = (e) => {
    console.log("Clicked");
  }
  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      {/* Order Details */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]"> Order Details </h1>
        </div>
      </div>
      {/* Order Id and date */}
      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#070707a1]">
          Order ID: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#070707a1]">
          Placed on: <span>#{data?.createdAt?.slice(0, 10)}</span>{" "}
        </h5>
      </div>
      {/* order items */}
      <br />
      <br />
      {data &&
        data?.cart?.map((item, index) => (
          <div className="w-full flex items-start mb-5">
            <img
              src={`${backend_url}uploads/${item?.images?.[0] ?? ""}`}
              alt=""
              className="w-[80px] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]"> {item.name}</h5>
              <h5 className="pl-3 text-[19px] text-[#00000091]">
                US$ {item.discountPrice} x {item.qty}
              </h5>
            </div>
            {
                data?.status === "Delivered" && (
                    <div className={`${styles.button} text-[#fff]`}>
                        Write a review
                    </div>
                )
            }
          </div>
        ))}
      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US$ {data?.totalPrice}</strong>{" "}
        </h5>
      </div>
      <br />
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}{" "}
          </h4>
          <h4 className="text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="text-[20px]">Payment Info: </h4>
          <h4 className="text-[20px]">Status: {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"} </h4>
        </div>
      </div>
      <br />
      <Link to = "/">
      <div className={`${styles.button} text-white`}>
        Send Message
      </div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default OrderDetails;
