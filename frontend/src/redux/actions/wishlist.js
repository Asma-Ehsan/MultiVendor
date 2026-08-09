// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
    dispatch({
        type: "addToWishlist",
        payload: data, //data is the product's data which is added in to the cart
    });

    // each time product is added to the cart, we will store the cart in local storage so that it can be retrieved on the initialState of the cartReducer
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
    return data;
}

//remove from wishlist
export const removeFromWishlist = (data) => async (dispatch, getState) => {
    dispatch({
        type: "removeFromWishlist",
        payload: data._id,
    });
    localStorage.setItem("wishlistItems", JSON.stringify(getState().wishlist.wishlist));
    return data;
}