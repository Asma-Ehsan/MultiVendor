import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Product/ProductDetails";
import { useParams } from "react-router-dom";
import SuggestedProduct from "../components/Product/SuggestedProduct";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { name } = useParams();
  const [data, setData] = useState(null);
  // useParam wil get the product name with "-" : "iphone-14-pro-max" but in productData it is stored without "-", so to replace "-" from " "
  useEffect(() => {
    window.scrollTo(0,0);
    const productName = name.replace(/-/g, " ");
    const data = allProducts && allProducts.find((i) => i.name === productName);
    setData(data);
  }, [allProducts, name]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
