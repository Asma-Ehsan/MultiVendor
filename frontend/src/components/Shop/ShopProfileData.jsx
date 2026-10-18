import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import Ratings from "../Product/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { AiOutlineArrowRight } from "react-icons/ai";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const [active, setActive] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return; //Checks for a valid shop ID. If none exists, stop and do nothing.
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  // .map() gets each product's reviews array, creating an array of arrays. i.e. [ [reviewA, reviewB] ]
  // .flat() merges them into one single reviews array i.e. [reviewA, reviewB, reviewC]

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
  <div className="w-full">
    {/* Tabs + Dashboard button */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div className="flex flex-wrap items-center gap-space-sm">
        {/* Shop Products */}
        <button
          type="button"
          onClick={() => setActive(1)}
          className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all duration-200 ${
            active === 1
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-lowest text-on-surface-variant border border-surface-container hover:bg-surface-container-high hover:text-on-surface"
          }`}
        >
          Shop Products
        </button>

        {/*  Running Events */}
        <button
          type="button"
          onClick={() => setActive(2)}
          className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all duration-200 ${
            active === 2
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-lowest text-on-surface-variant border border-surface-container hover:bg-surface-container-high hover:text-on-surface"
          }`}
        >
          Running Events
        </button>

        {/* Shop Reviews */}
        <button
          type="button"
          onClick={() => setActive(3)}
          className={`px-5 py-2.5 rounded-xl font-label-md text-label-md transition-all duration-200 ${
            active === 3
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-lowest text-on-surface-variant border border-surface-container hover:bg-surface-container-high hover:text-on-surface"
          }`}
        >
          Shop Reviews
        </button>
      </div>

      {/* Dashboard Button */}
      {isOwner && (
        <Link to="/dashboard" className="self-start md:self-auto">
          <div className="group px-6 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary font-label-md text-label-md transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2">
            <span>Go Dashboard</span>
            <AiOutlineArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </Link>
      )}
    </div>

    {/* If active === 1 */}
    {active === 1 && (
      <div className="mt-space-lg grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
        {products &&
          products.map((i, index) => (
            <ProductCard data={i} key={index} isShop={true} />
          ))}
      </div>
    )}

    {/* If active === 2 */}
    {active === 2 && (
      <div className="mt-space-lg grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
        {events && events.length > 0 ? (
          events.map((i, index) => (
            <ProductCard
              data={i}
              key={index}
              isEvent={true}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
            <p className="font-body-lg text-body-lg text-secondary">No events found!</p>
          </div>
        )}
      </div>
    )}

    {/* If active === 3 */}
    {active === 3 && (
      <div className="mt-space-lg space-y-space-md mb-12">
        {allReviews.length > 0 ?
          allReviews.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={`${item?.user?.avatar.url}`}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-fixed shrink-0"
                alt=""
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap w-full items-center gap-x-3">
                  <h1 className="font-label-md text-label-md text-on-surface font-semibold">{item.user.name}</h1>
                  <Ratings rating={item.rating} />
                </div>
                <p className="font-body-md text-body-md text-secondary mt-1 break-words">{item?.comment}</p>
                <p className="font-body-sm text-body-sm text-outline mt-1">
                  {item.createdAt ? item.createdAt.slice(0, 10) : null}
                </p>
              </div>
            </div>
          ))  : (
            <div className="py-16 text-center bg-surface-container-lowest rounded-2xl border border-surface-container">
              <p className="font-body-lg text-body-lg text-secondary">No reviews found!</p>
            </div>
          )}
      </div>
    )}
  </div>
);
};

export default ShopProfileData;
