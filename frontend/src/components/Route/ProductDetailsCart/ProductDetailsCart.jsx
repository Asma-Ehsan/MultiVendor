import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify';
import { addToCart } from "../../../redux/actions/cart";

const ProductDetailsCart = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  const handleMessageSubmit = () => {};
  
  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if(isItemExists){
      toast.error("Item already in cart!");
    }else{
      if(data.stock < count){
        toast.error("Product stock limited!")
      }else{
        const cartData = {...data, qty: count};
      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
      }
    }
  }

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4 ">
            {/* Cross button */}
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full 800px:flex ">
              {/* Left Side */}
              <div className="w-full 800px:w-[50%] ">
                <img
                  src={
                    data.images && data.images[0]
                      ? `${backend_url}uploads/${data.images[0]}`
                      : ""
                  }
                  alt=""
                />

                {/* Shop info */}
                <div className="flex">
                  <img
                    src={data?.shop?.avatar?.url}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-2 "
                  />
                  <div>
                    <h3 className={`${styles.shop_name}`}>
                      {" "}
                      {data.shop.name}{" "}
                    </h3>
                    <h5 className="pb-3 text-[15px]"> (4/5) Ratings </h5>
                  </div>
                </div>

                {/* Button to send a message to seller */}
                <div
                  className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11 `}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-[#fff] flex items-center">
                    Send Message <AiOutlineMessage className="ml-1" />
                  </span>
                </div>

                {/* Sold out */}
                <h5 className="text-[16px] text-[red] mt-5">
                  ({data.sold_out}) sold out
                </h5>
              </div>

              {/* Right Side */}
              <div className="w-full 800px:[50%] pt-5 pl-[5px] pr-[5px]">
                {/* Product info */}
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice} $
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + " $" : null}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-12 pr-3">
                  {/* " + " and " - "" buttons */}
                  <div className="flex items-center">
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 h-[40px] shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 h-[40px] flex items-center justify-center">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 h-[40px] shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  {/* Heart icons */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => setClick(!click)}
                        color={click ? "red" : "#333"}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Add to cart icon */}
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCart;
