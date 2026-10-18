import React, { useEffect, useState } from "react";
import { AiOutlineThunderbolt } from "react-icons/ai";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div>
      <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10 font-jakarta">
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
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-5 border-0">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;