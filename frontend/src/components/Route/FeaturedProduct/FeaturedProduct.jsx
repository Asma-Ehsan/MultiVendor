import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const{ allProducts } = useSelector((state) => state.products);
  return (
    <div>
      <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10 font-jakarta">
        <div className="mb-4">
          <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
            Discover More
          </span>
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
            Featured Products
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 border-0">
            {
                allProducts && allProducts.map((i, index) => <ProductCard data={i} key={index}/>)
            }
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;