import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { getImageUrl } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { Link } from "react-router-dom";

const ProductDetailsCart = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
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

  const removeFromWishListHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWIshListHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

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
                <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border overflow-hidden">
                  <img
                    src={getImageUrl(data.images && data.images[0])}
                    alt={data?.name || "product"}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Shop info */}
                <div className="flex items-center pt-4">
                  <img
                    src={data?.shop?.avatar?.url}
                    alt=""
                    className="w-[50px] h-[50px] rounded-full mr-2 "
                  />
                  <div className="">
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                      <h3 className={`${styles.shop_name} !pb-1`}>
                        {" "}
                        {data?.shop?.name}{" "}
                      </h3>
                    </Link>
                    <h5 className="pb-3 pt-0 text-[15px]"> (4/5) ratings </h5>
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
              </div>

              {/* Right Side */}
              <div className="w-full 800px:[50%] pt-5 pl-[18px] pr-[5px]">
                {/* Product info */}
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3 justify-between">
                  <div className="flex">
                    <h4 className={`${styles.productDiscountPrice}`}>
                      {data.discountPrice} $
                    </h4>
                    <span className={`${styles.price}`}>
                      {data.originalPrice ? data.originalPrice + " $" : null}
                    </span>
                  </div>
                  {/* Sold out */}
                  <h5 className="text-[16px] text-[red] pr-5">
                    ({data.sold_out}) sold out
                  </h5>
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
                        onClick={() => removeFromWishListHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWIshListHandler(data)}
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
