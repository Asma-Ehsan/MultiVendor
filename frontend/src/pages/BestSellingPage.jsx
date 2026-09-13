import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { productData } from "../static/data";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";

const BestSellingPage = () => {
  const [ data, setData ] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
   const allProductsData = allProducts ? [...allProducts] : [];
   const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out);
   setData(sortedData);
    window.scrollTo(0, 0);
  }, [allProducts]);
  return (
    <div>
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {
                data && data.map((i, index) => <ProductCard data = {i} key={index}/>)
            }
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default BestSellingPage;
