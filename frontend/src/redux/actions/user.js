import axios from "axios";
import { server } from "../../server";

//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({ type: "LoadUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response.data.message });
  }
};
//load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadSellerRequest" });

    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({ type: "LoadSellerSuccess", payload: data.seller });
  } catch (error) {
    dispatch({ type: "LoadSellerFail", payload: error.response.data.message });
  }
};

//user update information 
export const updateUserInformation = (email, password, phoneNumber, name) => async (dispatch, action) => {
  try {
    dispatch({ type: "UpdateUserInfoRequest" });

    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      { email, password, phoneNumber, name },   // body
      { withCredentials: true }                  // config
    );
    dispatch({ type: "UpdateUserInfoSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "UpdateUserInfoFail", payload: error.response.data.message });
  }
};

//update user address 
export const updateUserAddress = (country, city, address1, address2, addressType) => async (dispatch, action) => {
  try {
    dispatch({ type: "UpdateUserAddressRequest" });

    const { data } = await axios.put(
      `${server}/user/update-user-addresses`,
      { country, city, address1, address2, addressType },   // body
      { withCredentials: true }                  // config
    );
    dispatch({ type: "UpdateUserAddressSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "UpdateUserAddressFail", payload: error.response.data.message });
  }
};