import React, { useEffect, useState } from 'react'
import styles from '../../styles/styles';
import ProductCard from "../Route/ProductCard/ProductCard"
import { useSelector } from 'react-redux';

const SuggestedProduct = ({data}) => {
    const {allProducts} = useSelector((state) => state.products);
    const [productData, setProductData] = useState();

    //filter the products as per category
    // useEffect(() => {
    //     const d = allProducts && allProducts.filter((i) => i.category === data.category);
    //    setProductData(d);
    // }, []);
      
        useEffect(() => {
          const d =
            allProducts &&
            allProducts.filter(
              (i) => i.category === data.category && i._id !== data._id // exclude current product
            );
          setProductData(d);
        }, [allProducts, data]); // re-run when the viewed product changes
      
  return (
  <div>
    {data ? (
      <div className="mx-auto w-full max-w-[1320px] px-margin-mobile py-space-lg lg:px-margin">
        <div className="mb-space-md">
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
            Curated for you
          </span>
          <h2 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
            Related Products
          </h2>
        </div>

        <div className="mb-space-xl grid grid-cols-2 gap-gutter md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productData &&
            productData.map((i, index) => (
              <ProductCard data={i} key={index} />
            ))}
        </div>
      </div>
    ) : null}
  </div>
);
}

export default SuggestedProduct
