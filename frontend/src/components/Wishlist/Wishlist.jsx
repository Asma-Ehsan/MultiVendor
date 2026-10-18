import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { getImageUrl } from "../../server";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { Link } from "react-router-dom";

const Wishlist = ({ setOpenWishlist, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    toast.success("Items added to cart successfully!");
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-sm h-screen z-10 font-jakarta">
      <div className="fixed top-0 right-0 min-h-full w-full 800px:w-[25%] 800px:min-w-[360px] bg-surface-container-lowest flex flex-col justify-between shadow-2xl">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={32}
                className="cursor-pointer p-2 rounded-full text-on-surface hover:bg-error-container hover:text-error hover:rotate-90 transition-all duration-200"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
                <AiOutlineHeart size={36} />
              </div>
              <h5 className="text-body-lg font-semibold text-secondary">
                Wishlist items is empty!
              </h5>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto h-[90vh]">
            {/* Top bar: item length + cross icon */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center">
                  <AiOutlineHeart size={22} />
                </div>
                <h5 className="pl-3 text-headline-sm text-on-surface">
                  {" "}
                  {wishlist.length} items
                </h5>
              </div>
              <RxCross1
                size={32}
                className="cursor-pointer p-2 rounded-full text-on-surface hover:bg-error-container hover:text-error hover:rotate-90 transition-all duration-200"
                onClick={() => setOpenWishlist(false)}
              />
            </div>

            {/* Cart single items */}
            <div className="w-full">
              {wishlist &&
                wishlist.map((i, index) => (
                  <CartSingle
                    key={index}
                    data={i}
                    removeFromWishlistHandler={removeFromWishlistHandler}
                    addToCartHandler={addToCartHandler}
                    isEvent={isEvent}
                    setOpenWishlist={setOpenWishlist}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
  isEvent,
  setOpenWishlist,
}) => {
  //data will get from  <CartSingle key={index} data={i}/>
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;
  return (
    <div className="border-b border-surface-container p-4 hover:bg-surface-container-low/60 transition-colors duration-200">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center min-w-0">
          <RxCross1
            size={28}
            className="cursor-pointer flex-shrink-0 p-1.5 rounded-full text-secondary hover:bg-error-container hover:text-error transition-colors duration-200"
            onClick={() => removeFromWishlistHandler(data)}
          />
          <Link
            to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
            onClick={() => setOpenWishlist(false)}
          >
            <div className="w-[80px] h-[80px] ml-2 flex-shrink-0 bg-[#f5f8ff] border border-surface-container rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={getImageUrl(data.images && data.images[0])}
                alt={data?.name || "product"}
                className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="pl-3 min-w-0">
            {/* added line-clamp-2 — long names now wrap to a MAX of 2 lines with "..." at the end, instead of stretching the row to 5 lines */}
            <Link
              to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
              onClick={() => setOpenWishlist(false)}
            >
              <h1 className="line-clamp-2 text-body-md font-semibold text-on-surface hover:text-primary transition-colors">
                {data.name}
              </h1>
            </Link>
            <h4 className="font-extrabold text-[17px] pt-[3px] text-primary">
              US$ {totalPrice}
            </h4>
          </div>
        </div>
        <div
          onClick={() => addToCartHandler(data)}
          className="flex-shrink-0 ml-2 w-10 h-10 rounded-xl bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-95"
        >
          <BsCartPlus size={18} title="Add to cart" />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;