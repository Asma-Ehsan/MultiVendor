// add to wishlist
export const addToWishlist = (data) => async (dispatch, getState) => {
    dispatch({
        type: "addToWishlist",
        payload: data, //data is the product's data which is added in to the cart
    });

    // each time product is added to the cart, we will store the cart in local storage so that it can be retrieved on the initialState of the cartReducer

    //getState() → reads the current/latest Redux store inside a actions.

    //.wishlist → gets the wishlist slice from redux/stores.
    
    // The second .wishlist → gets the actual wishlist array from that slice.
    
    //So, getState().wishlist.wishlist = current wishlist products from Redux.

    //localStorage only stores strings, not arrays/objects.

    // JSON.stringify() converts the wishlist array/object into a string so it can be stored.
    
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