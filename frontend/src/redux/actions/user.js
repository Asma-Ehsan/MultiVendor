import axios from "axios";
import { server } from "../../server";

//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    /*
    Axios wraps the server response in its own object containing data, status, headers, etc.
    {
      data: { success: true, user: {...} },   // <-- this is exactly what your backend sent
      status: 200,
      headers: {...},
      // ...other axios-specific info
    }
    const { data } = await axios.get(...) extracts only the data property.
    Your data variable now contains exactly what the backend sent.
    */
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({ type: "LoadUserSuccess", payload: data.user }); //data.user extracts the user data from the backend response.Redux puts this data into the action as payload
  } catch (error) {
    dispatch({ type: "LoadUserFail", payload: error.response?.data?.message || error.message });
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
    dispatch({ type: "LoadSellerFail", payload: error.response?.data?.message || error.message });
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
    dispatch({ type: "UpdateUserInfoFail", payload: error.response?.data?.message || error.message });
  }
};

//update user address 
export const updateUserAddress = (country, city, address1, address2,zipCode, addressType) => async (dispatch, action) => {
  try {
    dispatch({ type: "UpdateUserAddressRequest" });

    const { data } = await axios.put(
      `${server}/user/update-user-addresses`,
      { country, city, address1, address2, zipCode, addressType },   // body
      { withCredentials: true }                  // config
    );
    dispatch({ type: "UpdateUserAddressSuccess", payload: {successMessage: "User address updated successfully!", user: data.user} });
  } catch (error) {
    dispatch({ type: "UpdateUserAddressFail", payload: error.response?.data?.message || error.message });
  }
};

//delete user address
export const deleteUserAddress = (id) => async (dispatch, action) => {
  try {
    dispatch({ type: "DeleteUserAddressRequest" });

    const { data } = await axios.delete(
      `${server}/user/delete-user-addresses/${id}`,
      { withCredentials: true }                  // config
    );
    dispatch({ type: "DeleteUserAddressSuccess", payload: {successMessage: "Address deleted successfully!", user: data.user} });
  } catch (error) {
    dispatch({ type: "DeleteUserAddressFail", payload: error.response?.data?.message || error.message });
  }
};