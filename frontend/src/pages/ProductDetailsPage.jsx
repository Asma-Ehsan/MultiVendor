import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from "../components/Product/ProductDetails"
import { useParams } from 'react-router-dom'
import { productData } from '../static/data'
import SuggestedProduct  from "../components/Product/SuggestedProduct"

const ProductDetailsPage = () => {
    const {name} = useParams();
    const [data, setData] = useState(null);
    // useParam wil get the product name with "-" : "iphone-14-pro-max" but in productData it is stored without "-", so to replace "-" from " "
    const productName = name.replace(/-/g, " ");

    //after replacing now we can find it in ProductData
    useEffect(() => {
        const data = productData.find((i) => i.name === productName);
        setData(data);
    },[])
  return (
    <div>
      <Header/>
      <ProductDetails data = {data}/>
      {
        data && <SuggestedProduct data={data}/>
      }
      <Footer/>
    </div>
  )
}

export default ProductDetailsPage
