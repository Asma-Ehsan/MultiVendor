import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ProductDetails = ({ data }) => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);
  // const { id } = useParams();
  const dispatch = useDispatch();

  console.log(data);

  useEffect(() => {
    if (data?.shop?._id) {
      dispatch(getAllProductsShop(data.shop._id));
    }
  }, [dispatch, data?.shop?._id]);

  const decrementCount = () => {
    if (count > 1) setCount(count - 1);
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const handleMessageSubmit = () => {
    navigate("/inbox?conversation=509763bcjxoou0w");
  };

  // CHANGED: build real image URLs from the backend upload folder
  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `${backend_url}uploads/${image}`;
    }
    return "";
  };

  // CHANGED: read product images from the backend shape (data.images)
  const productImages = (data?.images || []).map(getImageUrl);
  const mainImage = productImages[select] || productImages[0] || "";

  // CHANGED: read seller avatar from the shop object returned by the backend
  const shopAvatar = data?.shop?.avatar?.url || data?.shop?.shop_avatar?.url || "";

  return (
    <div className="bg-white">
      {data ? (
        <div className={` ${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              {/* Left Side */}
              <div className="w-full 800px:w-[50%] ">
                {/* CHANGED: show the main selected image */}
                <img
                  src={mainImage || "https://via.placeholder.com/300x300"}
                  alt={data.name}
                  className="w-[80%] object-contain"
                />

                {/* CHANGED: show thumbnails from the backend image array */}
                {productImages.length > 0 ? (
                  <div className="w-full flex gap-2 mt-3">
                    {productImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className={`h-[80px] w-[80px] object-cover cursor-pointer ${
                          select === index ? "border-2 border-teal-500" : "border"
                        }`}
                        onClick={() => setSelect(index)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Right Side */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice ?? data.discount_price ?? 0}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ?? data.price ? data.originalPrice ?? data.price + "$" : null}
                  </h3>
                </div>

                <div>
                  <div className="flex items-center justify-between mt-12 pr-3">
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
                </div>

                <div
                  className={`${styles.button} !mt-6 rounded-[4px] !h-11 flex items-center`}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />{" "}
                  </span>
                </div>

                <div className="flex items-center pt-8">
                  {/* CHANGED: show seller avatar from the backend shop object */}
                  <img
                    src={shopAvatar || "https://via.placeholder.com/50"}
                    alt=""
                    className="w-[50px] h-[50px] mr-2 rounded-full"
                  />
                  <div className="pr-8">
                    <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                      {data?.shop?.name || "Seller"}
                    </h3>
                    <h5 className="pb-3 text-[15px]">
                      (4/5) Ratings
                    </h5>
                  </div>

                  <div
                    className={`${styles.button} bg-[#6443d1] !mt-4 rounded !h-11`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo data={data} products={products}/>
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data, products}) => {
  const [active, setActive] = useState(1);

  // CHANGED: use the same shop avatar logic in the seller info section
  const shopAvatar = data?.shop?.avatar?.url || data?.shop?.shop_avatar?.url || "";

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? <div className={`${styles.active_indicator}`} /> : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description || "No description available."}
          </p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full justify-center min-h-[40vh] flex items-center">
          <p>No Reviews yet!</p>
        </div>
      ) : null}

      {active === 3 ? (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              {/* CHANGED: show seller avatar from the backend shop object */}
              <img
                src={shopAvatar}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="pl-3">
                <h3 className={`${styles.shop_name}`}>
                  {data?.shop?.name || "Seller"}
                </h3>
                <h5 className="p2-3 text-[15px]">
                  ({data?.shop?.ratings || "4.5"}) Ratings
                </h5>
              </div>
            </div>
            <p className="pt-2">
              {data.shop.description || "Seller information will appear here."}
            </p>
          </div>

          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on: <span className="font-[500]">{data?.shop?.createdAt?.slice(0,10)}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products: <span className="font-[500]"> {products && products.length }</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews: <span className="font-[500]">131</span>
              </h5>
              <Link to="/">
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] !mt-3`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;