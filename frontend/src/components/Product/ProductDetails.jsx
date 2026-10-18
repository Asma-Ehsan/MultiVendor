import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, getImageUrl, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import Ratings from "./Ratings";
import axios from "axios";

// this data contains details of the product which is clicked by the user
const ProductDetails = ({ data }) => {
  const { products } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.shop?._id) {
      // to get products.length in shop info section
      dispatch(getAllProductsShop(data.shop._id));
    }
  }, [dispatch, data?.shop?._id]);

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

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
        toast.error("Product stock is limited");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Items added o cart successfully!");
      }
    }
  };

  //if there are images in data, then map them to get their URLs using the getImageUrl function. If there are no images, use an empty array.
  const productImages = (data?.images || []).map(getImageUrl);
  const mainImage = productImages[select] || productImages[0] || "";

  const shopAvatar =
    data?.shop?.avatar?.url || "";

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
  <div className="bg-background">
    {data ? (
      <div className="mx-auto w-full max-w-[1320px] px-margin-mobile py-space-lg lg:px-margin">
        {/* ===== Main card ===== */}
        <div className="rounded-3xl border border-surface-container bg-surface-container-lowest p-space-md shadow-[0_8px_30px_rgba(11,28,48,0.05)] sm:p-space-lg">
          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
            {/* ---------- Left side: images ---------- */}
            <div className="lg:col-span-5">
              <div className="group flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-surface-container bg-[#f5f8ff]">
                <img
                  src={mainImage || "https://via.placeholder.com/300x300"}
                  alt={data.name}
                  className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>

              {productImages.length > 0 ? (
                <div className="mt-space-md grid grid-cols-4 gap-space-sm">
                  {productImages.map((image, index) => (
                    <div
                      className={`flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border bg-[#f5f8ff] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        select === index
                          ? "border-primary ring-2 ring-primary"
                          : "border-surface-container"
                      }`}
                      key={index}
                      onClick={() => setSelect(index)}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* ---------- Right side: info ---------- */}
            <div className="flex flex-col lg:col-span-7">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                {data.name}
              </h1>

              <p className="mt-space-sm whitespace-pre-line font-body-lg text-body-lg leading-relaxed text-secondary">
                {data.description}
              </p>

              {/* Price */}
              <div className="mt-space-md flex items-baseline gap-3">
                <h4 className="font-price-lg text-[32px] font-extrabold tracking-tight text-on-surface">
                  {data.discountPrice ?? data.discount_price ?? 0}$
                </h4>
                <h3 className="font-body-lg text-body-lg font-semibold text-outline line-through">
                  {data?.originalPrice ? data.originalPrice + "$" : null}
                </h3>
              </div>

              {/* Quantity + Add to cart + Heart */}
              <div className="mt-space-lg flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-surface-container bg-surface-container-low p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={decrementCount}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-bold text-white transition-colors hover:bg-teal-600"
                  >
                    -
                  </button>
                  <span className="w-12 select-none text-center font-label-md text-label-md font-bold text-on-surface">
                    {count}
                  </span>
                  <button
                    type="button"
                    onClick={incrementCount}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 font-bold text-white transition-colors hover:bg-teal-600"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addToCartHandler(data._id)}
                  className="flex min-w-[160px] flex-1 items-center justify-center gap-2 rounded-xl bg-inverse-surface px-6 py-3 font-label-md text-label-md text-inverse-on-surface shadow-md transition-all duration-200 hover:bg-primary hover:shadow-lg active:scale-[0.99]"
                >
                  <AiOutlineShoppingCart size={18} />
                  Add to cart
                </button>

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

              {/* Seller card */}
              <div className="mt-space-lg flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-container bg-surface-container-low/70 p-space-md">
                <div className="flex min-w-0 items-center gap-3">
                  <Link to={`/shop/preview/${data?.shop?._id}`}>
                    <img
                      src={shopAvatar || "https://via.placeholder.com/50"}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full border border-surface-variant object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                      <h3 className="truncate font-label-md text-label-md font-bold text-on-surface transition-colors hover:text-primary">
                        {data?.shop?.name || "Seller"}
                      </h3>
                    </Link>
                    <h5 className="font-body-sm text-body-sm text-secondary">
                      ({averageRating}/5) Ratings
                    </h5>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMessageSubmit}
                  className="flex items-center gap-1.5 rounded-xl border border-surface-variant bg-surface-container-lowest px-4 py-2 font-label-md text-label-md text-on-surface shadow-sm transition-all duration-200 hover:bg-inverse-surface hover:text-inverse-on-surface"
                >
                  Send Message <AiOutlineMessage size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Tabs section (your old component, same props) ===== */}
        <div className="mt-space-xl">
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      </div>
    ) : null}
  </div>
);
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  const shopAvatar =
    data?.shop?.avatar?.url || "";

  return (
  <div className="overflow-hidden rounded-3xl border border-surface-container bg-surface-container-lowest shadow-[0_8px_30px_rgba(11,28,48,0.05)]">
    {/* ===== Tab bar ===== */}
    <div className="flex gap-space-lg overflow-x-auto border-b border-surface-container bg-surface-container-low/60 px-space-md sm:px-space-lg">
      {/* Product Details */}
      <button
        type="button"
        onClick={() => setActive(1)}
        className={`whitespace-nowrap border-b-2 py-4 font-label-md text-label-md transition-colors duration-200 ${
          active === 1
            ? "border-primary font-bold text-primary"
            : "border-transparent text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Product Details
      </button>

      {/* Product Reviews */}
      <button
        type="button"
        onClick={() => setActive(2)}
        className={`whitespace-nowrap border-b-2 py-4 font-label-md text-label-md transition-colors duration-200 ${
          active === 2
            ? "border-primary font-bold text-primary"
            : "border-transparent text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Product Reviews
      </button>

      {/* Seller Information */}
      <button
        type="button"
        onClick={() => setActive(3)}
        className={`whitespace-nowrap border-b-2 py-4 font-label-md text-label-md transition-colors duration-200 ${
          active === 3
            ? "border-primary font-bold text-primary"
            : "border-transparent text-on-surface-variant hover:text-on-surface"
        }`}
      >
        Seller Information
      </button>
    </div>

    {/* ===== Tab 1: Product Details ===== */}
    {active === 1 ? (
      <div className="p-space-md sm:p-space-lg">
        <h3 className="mb-space-sm font-headline-sm text-headline-sm text-on-surface">
          Product Overview
        </h3>
        <p className="whitespace-pre-line font-body-lg text-body-lg leading-relaxed text-secondary">
          {data.description || "No description available."}
        </p>
      </div>
    ) : null}

    {/* ===== Tab 2: Product Reviews ===== */}
    {active === 2 ? (
      <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-space-md overflow-y-auto p-space-md sm:p-space-lg">
        {data && data.reviews ? (
          data.reviews.map((item, index) => (
            <div
              className="flex w-full items-start gap-3 rounded-2xl border border-surface-container bg-surface-container-low/60 p-space-md transition-shadow duration-300 hover:shadow-md"
              key={item._id || index}
            >
              <img
                src={item?.user?.avatar?.url}
                alt=""
                className="h-12 w-12 shrink-0 rounded-full border border-surface-variant object-cover"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <h1 className="font-label-md text-label-md font-bold text-on-surface">
                    {item?.user?.name}
                  </h1>
                  <Ratings rating={data?.ratings || 0} />
                </div>
                <p className="mt-1 font-body-md text-body-md text-secondary">
                  {item?.comment || "No comment provided"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <h5 className="text-center font-body-md text-body-md text-secondary">
            No reviews found!
          </h5>
        )}
        <div className="flex w-full justify-center">
          {data && data.reviews && data.reviews.length === 0 && (
            <h5 className="text-center font-body-md text-body-md text-secondary">
              No Reviews have for this product!
            </h5>
          )}
        </div>
      </div>
    ) : null}

    {/* ===== Tab 3: Seller Information ===== */}
    {active === 3 ? (
      <div className="grid grid-cols-1 gap-space-lg p-space-md sm:p-space-lg md:grid-cols-2">
        {/* Seller box */}
        <div>
          <div className="flex items-center gap-3">
            <Link to={`/shop/preview/${data?.shop?._id}`}>
              <img
                src={shopAvatar}
                alt=""
                className="h-14 w-14 rounded-full border border-surface-variant object-cover"
              />
            </Link>
            <div>
              <Link to={`/shop/preview/${data?.shop._id}`}>
                <h3 className="font-headline-sm text-headline-sm text-on-surface transition-colors hover:text-primary">
                  {data?.shop?.name || "Seller"}
                </h3>
              </Link>
              <h5 className="font-body-sm text-body-sm text-secondary">
                ({averageRating})/5 Ratings
              </h5>
            </div>
          </div>
          <p className="mt-space-sm whitespace-pre-line font-body-md text-body-md leading-relaxed text-secondary">
            {data?.shop?.description || ""}
          </p>
        </div>

        {/* Seller stats */}
        <div className="flex flex-col gap-space-sm rounded-2xl border border-surface-container bg-surface-container-low/60 p-space-md">
          <h5 className="font-label-md text-label-md font-bold text-on-surface">
            Joined on:{" "}
            <span className="font-medium text-secondary">
              {data?.shop?.createdAt?.slice(0, 10)}
            </span>
          </h5>
          <h5 className="font-label-md text-label-md font-bold text-on-surface">
            Total Products:{" "}
            <span className="font-medium text-secondary">
              {" "}
              {products && products.length}
            </span>
          </h5>
          <h5 className="font-label-md text-label-md font-bold text-on-surface">
            Total Reviews:{" "}
            <span className="font-medium text-secondary">
              {totalReviewsLength}
            </span>
          </h5>
          <Link to={`/shop/preview/${data?.shop._id}`} className="mt-space-xs">
            <div className="flex items-center justify-center rounded-xl bg-inverse-surface px-5 py-2.5 font-label-md text-label-md text-inverse-on-surface shadow-md transition-all duration-200 hover:bg-primary hover:shadow-lg">
              Visit Shop
            </div>
          </Link>
        </div>
      </div>
    ) : null}
  </div>
);
};

export default ProductDetails;
