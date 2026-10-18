import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { getImageUrl, server } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetailsCart = ({ setOpen, data }) => {
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data?.shop?._id;
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

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  // Two nested `reduce()` calls: outer loops through products, inner loops through each product's reviews.
  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0,
    );

  const averageRating = totalReviewsLength > 0 ? (totalRatings / totalReviewsLength).toFixed(1) : 0;

  return (
  <div>
    {data ? (
      // Dark overlay. z-[100] puts it ABOVE the fixed header (z-50)
      <div
        className="fixed inset-0 z-[100] flex overflow-y-auto bg-inverse-surface/60 p-4 backdrop-blur-sm sm:p-6"
        onClick={() => setOpen(false)}
      >
        {/* Card. m-auto centers it, even on small screens */}
        <div
          className="relative m-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-surface-container bg-surface-container-lowest shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <RxCross1 size={16} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* ================= LEFT SIDE ================= */}
            <section className="flex flex-col justify-between border-b border-surface-container bg-gradient-to-b from-surface-container-low to-surface-container-lowest p-5 sm:p-6 md:col-span-5 md:border-b-0 md:border-r">
              {/* Product image */}
              <div className="group flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-surface-container bg-surface-container-lowest shadow-sm">
                <img
                  src={getImageUrl(data.images && data.images[0])}
                  alt={data?.name || "product"}
                  className="h-full w-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {/* Shop info + Send message */}
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-surface-container pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <Link to={`/shop/preview/${data?.shop?._id}`}>
                    <img
                      src={data?.shop?.avatar?.url}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-full border border-surface-container object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                      <h3 className="truncate font-label-md text-label-md font-bold text-on-surface transition-colors hover:text-primary">
                        {data?.shop?.name}
                      </h3>
                    </Link>
                    <h5 className="font-body-sm text-body-sm text-secondary">
                      ({averageRating}/5) ratings
                    </h5>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMessageSubmit}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-surface-variant bg-surface-container-lowest px-3 py-2 font-label-md text-label-md text-on-surface shadow-sm transition-all duration-200 hover:bg-inverse-surface hover:text-inverse-on-surface"
                >
                  Send Message <AiOutlineMessage size={16} />
                </button>
              </div>
            </section>

            {/* ================= RIGHT SIDE ================= */}
            <section className="flex flex-col justify-between p-5 sm:p-8 md:col-span-7">
              <div>
                {/* Title (pr-10 keeps it away from the close button) */}
                <h1 className="pr-10 font-headline-md text-headline-md leading-snug tracking-tight text-on-surface">
                  {data.name}
                </h1>

                {/* Sold out badge */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-error/20 bg-error-container/70 px-2.5 py-0.5 font-label-sm text-label-sm text-on-error-container">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-error"></span>
                    ({data.sold_out}) sold out
                  </span>
                </div>

                {/* Description (scrolls if long) */}
                <p className="mt-4 max-h-56 overflow-y-auto whitespace-pre-line pr-1 font-body-md text-body-md leading-relaxed text-secondary">
                  {data.description}
                </p>
              </div>

              {/* Price + buttons */}
              <div className="mt-6 border-t border-surface-container pt-5">
                <div className="mb-4 flex items-baseline gap-3">
                  <h4 className="font-price-lg text-[28px] font-extrabold tracking-tight text-on-surface">
                    {data.discountPrice} $
                  </h4>
                  <span className="font-body-lg text-body-lg font-semibold text-outline line-through">
                    {data.originalPrice ? data.originalPrice + " $" : null}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* " - " and " + " buttons */}
                  <div className="inline-flex items-center rounded-xl border border-surface-container bg-surface-container-low p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={decrementCount}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 font-bold text-white transition-colors hover:bg-teal-600"
                    >
                      -
                    </button>
                    <span className="w-10 select-none text-center font-label-md text-label-md font-bold text-on-surface">
                      {count}
                    </span>
                    <button
                      type="button"
                      onClick={incrementCount}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500 font-bold text-white transition-colors hover:bg-teal-600"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    type="button"
                    onClick={() => addToCartHandler(data._id)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-inverse-surface px-5 py-3 font-label-md text-label-md text-inverse-on-surface shadow-md transition-all duration-200 hover:bg-primary hover:shadow-lg active:scale-[0.99]"
                  >
                    <AiOutlineShoppingCart size={18} />
                    Add to cart
                  </button>

                  {/* Heart */}
                  {click ? (
                    <button
                      type="button"
                      title="Remove from wishlist"
                      onClick={() => removeFromWishListHandler(data)}
                      className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                    >
                      <AiFillHeart
                        size={24}
                        className="transition-transform group-hover:scale-110"
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      title="Add to wishlist"
                      onClick={() => addToWIshListHandler(data)}
                      className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100"
                    >
                      <AiOutlineHeart
                        size={24}
                        className="transition-transform group-hover:scale-110"
                      />
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    ) : null}
  </div>
);
};

export default ProductDetailsCart;
