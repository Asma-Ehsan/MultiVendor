import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import {server} from "../../server"
import axios from "axios"
import Loader from "../Layout/Loader"
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { MdOutlineCalendarToday, MdOutlineLocationOn, MdOutlinePhone } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";

const ShopInfo = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  // const { seller } = useSelector((state) => state.seller);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios.get(`${server}/shop/get-shop-info/${id}`).then((res) => {
      setData(res.data.shop);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    })
  }, []);

  const logoutHandler = async() => {
    await axios.get(`${server}/shop/logout`, {withCredentials: true});
    window.location.reload(true);
    navigate("/shop-login")
  };

  const totalReviewsLength = products && products.reduce((acc , product) => acc + product.reviews.length, 0);

  // Two nested `reduce()` calls: outer loops through products, inner loops through each product's reviews.

  const totalRatings = products && products.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),0);

   const averageRating = totalReviewsLength > 0 ? (totalRatings / totalReviewsLength).toFixed(1) : 0;


  return (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
        {/* Soft banner behind the avatar */}
        <div className="h-24 bg-gradient-to-br from-[#ecf2ff] via-[#e5eeff] to-[#dae6fd]"></div>

        <div className="px-space-lg pb-space-lg">
          {/* Avatar */}
          <div className="-mt-14 flex justify-center">
            <img
              src={`${data?.avatar?.url}`}
              alt=""
              className="w-28 h-28 rounded-full object-cover ring-4 ring-surface-container-lowest shadow-md"
            />
          </div>

          {/* Name + description */}
          <h3 className="text-center mt-space-sm font-headline-md text-headline-md text-on-surface tracking-tight">
            {data.name}
          </h3>
          <p className="text-center font-body-md text-body-md text-secondary mt-1">
            {data?.description}
          </p>

          {/* Info rows */}
          <div className="mt-space-lg space-y-space-md">
            {/* Address */}
            <div className="group flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <MdOutlineLocationOn size={18} />
              </div>
              <div className="min-w-0">
                <h5 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Address
                </h5>
                <h4 className="font-body-md text-body-md text-on-surface break-words">
                  {data?.address}
                </h4>
              </div>
            </div>

            {/* Phone Number */}
            <div className="group flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <MdOutlinePhone size={18} />
              </div>
              <div className="min-w-0">
                <h5 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Phone Number
                </h5>
                <h4 className="font-body-md text-body-md text-on-surface break-words">
                  {data?.phoneNumber}
                </h4>
              </div>
            </div>

            {/* Total Products */}
            <div className="group flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-container/70 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <FiPackage size={18} />
              </div>
              <div className="min-w-0">
                <h5 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Total Products
                </h5>
                <h4 className="font-body-md text-body-md text-on-surface">
                  {products && products.length}
                </h4>
              </div>
            </div>

            {/* Shop Ratings */}
            <div className="group flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <AiFillStar size={18} />
              </div>
              <div className="min-w-0">
                <h5 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Shop Ratings
                </h5>
                <h4 className="font-body-md text-body-md text-on-surface">
                  {averageRating}/5
                </h4>
              </div>
            </div>

            {/* Joined On */}
            <div className="group flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-high/80 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
                <MdOutlineCalendarToday size={18} />
              </div>
              <div className="min-w-0">
                <h5 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Joined On
                </h5>
                <h4 className="font-body-md text-body-md text-on-surface">
                  {data?.createdAt?.slice(0, 10)}
                </h4>
              </div>
            </div>
          </div>

          {/* Owner buttons */}
          {isOwner && (
            <div className="mt-space-lg pt-space-md border-t border-surface-container space-y-space-sm">
              <Link to="/settings">
                <div className="w-full py-3 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary font-label-md text-label-md text-center transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer">
                  Edit Shop
                </div>
              </Link>
              <div
                className="w-full py-3 rounded-xl border border-error/30 text-error hover:bg-error-container hover:text-on-error-container font-label-md text-label-md text-center transition-all duration-200 cursor-pointer active:scale-95"
                onClick={logoutHandler}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);
};

export default ShopInfo;
