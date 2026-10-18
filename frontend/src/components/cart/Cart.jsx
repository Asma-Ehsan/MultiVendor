import  { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { HiMinus, HiPlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {  getImageUrl } from "../../server";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart, isEvent }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0,
  );

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-sm h-screen z-10 font-jakarta">
      <div className="fixed top-0 right-0 min-h-full w-full 800px:w-[25%] 800px:min-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-2xl">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={32}
                className="cursor-pointer p-2 rounded-full text-on-surface hover:bg-error-container hover:text-error hover:rotate-90 transition-all duration-200"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                <IoBagHandleOutline size={36} />
              </div>
              <h5 className="text-body-lg font-semibold text-secondary">
                Cart items is empty!
              </h5>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto h-[90vh]">
              {/* Top bar: item length + cross icon */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center">
                    <IoBagHandleOutline size={22} />
                  </div>
                  <h5 className="pl-3 text-headline-sm text-on-surface">
                    {cart.length} items
                  </h5>
                </div>
                <RxCross1
                  size={32}
                  className="cursor-pointer p-2 rounded-full text-on-surface hover:bg-error-container hover:text-error hover:rotate-90 transition-all duration-200"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              {/* Cart single items */}
              <div className="w-full">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                      isEvent={isEvent}
                      setOpenCart={setOpenCart}
                    />
                  ))}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-surface-container">
              {/* Checkout button */}
              <Link
                to="/checkout"
                className="group h-12 flex items-center justify-center gap-1 w-[100%] bg-inverse-surface text-inverse-on-surface hover:bg-primary rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h1 className="text-label-md">
                  Checkout Now (USD$ {totalPrice})
                </h1>
                <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  isEvent,
  setOpenCart,
}) => {
  //data will get from  <CartSingle key={index} data={i}/>
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b border-surface-container p-4 hover:bg-surface-container-low/60 transition-colors duration-200">
      <div className="w-full flex items-start justify-between">
        <div className="flex items-start min-w-0">
          <Link
            to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
            onClick={() => setOpenCart(false)}
          >
            <div className="w-[90px] h-[90px] mr-3 flex-shrink-0 bg-[#f5f8ff] border border-surface-container rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl(data?.images?.[0])}
                alt={data?.name || "product"}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          <div className="min-w-0">
            <Link
              to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
              onClick={() => setOpenCart(false)}
            >
              <h1 className="line-clamp-2 text-body-md font-semibold text-on-surface hover:text-primary transition-colors">
                {data.name}
              </h1>
            </Link>
            <h4 className="text-body-sm text-secondary">
              ${data.discountPrice} * {value}
            </h4>
            <h4 className="font-extrabold text-[17px] pt-[2px] text-primary">
              US$ {totalPrice}
            </h4>

            {/* Quantity buttons */}
            <div className="inline-flex items-center gap-2 mt-2 p-1 rounded-full bg-surface-container-low border border-surface-container">
              {/* Decrement */}
              <div
                className="bg-surface-container-lowest text-secondary hover:bg-surface-container-high rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer transition-colors duration-200 active:scale-95"
                onClick={() => decrement(data)}
              >
                <HiMinus size={14} />
              </div>
              <span className="text-label-md font-bold min-w-[20px] text-center text-on-surface">
                {data.qty}
              </span>
              {/* Increment */}
              <div
                className="bg-primary text-on-primary hover:bg-primary-container rounded-full w-[26px] h-[26px] flex items-center justify-center cursor-pointer transition-colors duration-200 active:scale-95"
                onClick={() => increment(data)}
              >
                <HiPlus size={14} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <RxCross1
            size={28}
            className="cursor-pointer p-1.5 rounded-full text-secondary hover:bg-error-container hover:text-error transition-colors duration-200"
            onClick={() => removeFromCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;