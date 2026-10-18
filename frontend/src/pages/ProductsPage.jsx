import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
const ProductsPage = () => {

  const { allProducts, isLoading } = useSelector((state) => state.products)
  const [ searchParams ] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [ data, setData ] = useState([]);
  
  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts;
      setData(d);
    } else {
      const d =
      allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
    window.scrollTo(0, 0);
  }, [allProducts]);
  
  return (
    <>{
      isLoading ? (
        <Loader/>
      ): (
        <div className="bg-background font-jakarta">
        <Header activeHeading={3} />
        {/* heading and cards are in ONE container, so they have the same left edge */}
        <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-10 mb-10">
          <div className="mb-4">
            <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
              {categoryData ? "Category" : "Discover More"}
            </span>
            <h1 className="text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              {categoryData ? categoryData : "All Products"}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {
                  data && data.map((i, index) => <ProductCard data = {i} key={index}/>)
              }
          </div>
          {
                  data && data.length === 0 ?
                  (
                      <h1  className="text-center w-full py-16 text-headline-md text-secondary">No products found</h1>
                  ) : null
              }
        </div>
        <Footer/>
      </div>
      )
    }
    </>
  );
};
export default ProductsPage;