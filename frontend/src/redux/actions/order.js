import { server } from "../../server";
import axios from "axios";

//get all products of a shop
export const getAllOrdersOfUser = (userId) => async(dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    const {data} = await axios.get(`${server}/order/get-all-orders/${userId}`);
    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });

  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response.data.message,
    });
  }
}