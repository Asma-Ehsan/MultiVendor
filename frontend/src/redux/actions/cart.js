


// add to cart
export const addToCart = (data) => async (dispatch, getState) => {
    dispatch({
        type: "addToCart",
        payload: data, //data is the product's data which is added in to the cart
    });

    // each time product is added to the cart, we will store the cart in local storage so that it can be retrieved on the initialState of the cartReducer
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
}

//remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
    dispatch({
        type: "removeFromCart",
        payload: data._id,
    });
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return data;
}