import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import ProductDetailsCart from "../ProductDetailsCart/ProductDetailsCart.jsx"
import { getImageUrl } from "../../../server.js";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist.js";
import { addToCart } from "../../../redux/actions/cart.js";
import { toast } from "react-toastify";
import Ratings from "../../Product/Ratings.jsx";

const ProductCard = ({ data, isEvent }) => {
  const {wishlist} = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) return;
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishListHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  }

  const addToWIshListHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  }

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
        if(isItemExists){
          toast.error("Item already in cart!");
        }else{
          if(data.stock < 1){
            toast.error("Product stock is limited");
          }else{
            const cartData = { ...data, qty: 1};
            dispatch(addToCart(cartData));
            toast.success("Items added o cart successfully!");
          }
        }
  }

  return (
    <>
      <div className="group w-full relative cursor-pointer bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-container/80 shadow-[0_4px_16px_-4px_rgba(11,28,48,0.04)] hover:shadow-xl hover:border-primary-fixed/60 transition-all duration-300 flex flex-col justify-between font-jakarta">
        {/* Product image area */}
        <div className="relative w-full aspect-square bg-[#f5f8ff] p-4 flex items-center justify-center overflow-hidden">
          <Link
            to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
            className="w-full h-full block"
          >
            <img
              src={getImageUrl(data.images && data.images[0])}
              alt=""
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* side options (always visible on phones, show on hover on bigger screens) */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 800px:opacity-0 800px:translate-x-2 800px:group-hover:opacity-100 800px:group-hover:translate-x-0 transition-all duration-200">
            {click ? (
              <AiFillHeart
                size={32}
                className="cursor-pointer p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-md border border-white/60 hover:scale-110 transition-transform"
                onClick={() => removeFromWishListHandler(data)}
                color={click ? "red" : "#333"}
                title="Remove from wishlist"
              />
            ) : (
              <AiOutlineHeart
                size={32}
                className="cursor-pointer p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-md border border-white/60 hover:scale-110 transition-transform"
                onClick={() => addToWIshListHandler(data)}
                color={click ? "red" : "#333"}
                title="Add to wishlist"
              />
            )}
            <AiOutlineEye
              size={32}
              className="cursor-pointer p-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-md border border-white/60 hover:scale-110 transition-transform"
              onClick={() => setOpen(!open)}
              color="#333"
              title="Quick view"
            />
          </div>
        </div>

        {/* Card details */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Shop info */}
          <Link to={`/shop/preview/${data?.shop?._id}`}>
            <h5 className="text-label-sm text-secondary font-medium mb-1 hover:text-primary transition-colors">
              {data?.shop?.name}
            </h5>
          </Link>
          <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
            <h4 className="text-body-md text-on-surface font-semibold line-clamp-2 min-h-[40px] mb-2 group-hover:text-primary transition-colors">
              {data?.name?.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
            </h4>

            {/* rating stars */}
            <div className="flex">
              <Ratings rating = {data?.ratings}/>
            </div>

            {/* price and no.of solds */}
            <div className="py-2 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <h5 className="text-price-lg text-on-surface font-extrabold">
                  {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}$
                </h5>
                <h4 className="text-body-sm text-outline line-through">
                  {data.originalPrice ? data.originalPrice + "$" : null}
                </h4>
              </div>
              <span className="text-body-sm font-medium text-[#3bc177] whitespace-nowrap">
                {data?.sold_out} sold
              </span>
            </div>
          </Link>

          {/* Add to cart button */}
          <button
            type="button"
            className="mt-auto w-full py-2 px-3 rounded-xl bg-surface-container-low text-on-surface hover:bg-inverse-surface hover:text-inverse-on-surface text-label-md transition-all duration-200 border border-surface-container flex items-center justify-center gap-1.5"
            title="Add to cart"
            onClick={() => addToCartHandler(data._id)}
          >
            <AiOutlineShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* quick view popup */}
        {open ? (
          <ProductDetailsCart setOpen= {setOpen} data= {data} />
        ): null}
      </div>
    </>
  );
};

export default ProductCard;