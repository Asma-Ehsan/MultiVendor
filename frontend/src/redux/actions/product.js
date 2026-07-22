import { server } from "../../server";
import axios from "axios";

//create product
export const createProduct = (newForm) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    //this is for sending request to DB
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(
      `${server}/product/create-product`,
      newForm,
      config
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product, //the data from this line of controller: const product = await Product.create(productData);
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response.data.message,
    });
  }
};

//get all products
export const getAllProductsShop = (id) => async(dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const {data} = await axios.get(`${server}/product/get-all-products-shop/${id}`)
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products, //the data from this line of controller: const product = await Product.create(productData);
    });

  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
}