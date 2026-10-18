import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import { AiOutlineThunderbolt } from "react-icons/ai";

const BestSellingPage = () => {
  
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    setData(sortedData);
    window.scrollTo(0, 0);
  }, [allProducts]);

  return (
    <div className="bg-background font-jakarta">
      <Header activeHeading={2} />
      {/* heading and cards are in ONE container, so they have the same left edge */}
      <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10">
        <div className="mb-4">
          <div className="flex items-center gap-1 text-error font-bold">
            <AiOutlineThunderbolt size={18} />
            <span className="text-label-sm uppercase tracking-wider">
              Lightning Deals
            </span>
          </div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            Best Deals
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default BestSellingPage;