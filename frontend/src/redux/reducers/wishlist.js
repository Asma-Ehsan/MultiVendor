import {createReducer} from "@reduxjs/toolkit";

//it will check if there is any wishlist items in local storage or not, if yes then it will return the wishlist items from local storage(which is stired in actions) otherwise it will return an empty array
const initialState = {
    wishlist: localStorage.getItem("wishlistItems") ? JSON.parse(localStorage.getItem("wishlistItems")): [],
}

export const wishlistReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("addToWishlist", (state, action) => {
        const item = action.payload;
        // check if the item is already in the wishlist or not
        const isItemExists = state.wishlist.find((i) => i._id === item._id); 
        if(isItemExists){
            // item already in wishlist — replace it (e.g. to update qty) instead of duplicating
            return {
                ...state,
                // wishlist: [...state.wishlist, item],
                wishlist: state.wishlist.map((i) => (i._id === isItemExists._id ? item : i)),
            };
        }else{
            // brand new item — actually add it
        return {
            ...state,
            wishlist: [...state.wishlist, item],
        }; 
        }
    })
    .addCase("removeFromWishlist", (state, action) => {
       return {
        ...state, 
        wishlist: state.wishlist.filter((i) => i._id !== action.payload)
       };
    })
})