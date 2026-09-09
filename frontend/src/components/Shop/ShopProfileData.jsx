import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import Ratings from "../Product/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const { events } = useSelector((state) => state.events);
  const [active, setActive] = useState(1);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          {/* Shop Products */}
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>

          {/*  Running Events */}
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          {/* Shop Reviews */}
          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>

        {/* Dashboard Button */}
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* If active === 1 */}
      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => {
              const transformed = {
                ...i,
                image_Url: i.images.map((filename) => ({
                  url: `http://localhost:8000/uploads/${filename}`,
                })),
              };
              return (
                <ProductCard data={transformed} key={index} isShop={true} />
              );
            })}
        </div>
      )}

      {/* If active === 2 */}
      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events && events.length > 0 ? (
              events.map((i, index) => {
                const transformed = {
                  ...i,
                  image_Url: i.images.map((filename) => ({
                    url: `http://localhost:8000/uploads/${filename}`,
                  })),
                };
                return (
                  <ProductCard data={transformed} key={index} isShop={true} isEvent = {true} />
                );
              })
            ) : (
              <div className="w-full col-span-full h-[60vh] flex items-center justify-center">
                <p className="text-center text-[20px]">No events found!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* If active === 3 */}
      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4 items-center">
                <img
                  src={`${item?.user?.avatar.url}`}
                  className="w-[50px] h-[50px] rounded-full border-[#1b1b1b38] border-[2px]"
                  alt=""
                />
                <div className="p-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-3">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {item.createdAt || "2 days ago"}
                  </p>
                </div>
                {console.log(item)}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
