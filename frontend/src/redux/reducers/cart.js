import {createReducer} from "@reduxjs/toolkit";

//it will check if there is any cart items in local storage or not, if yes then it will return the cart items from local storage(which is stired in actions) otherwise it will return an empty array
const initialState = {
    cart: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")): [],
}

export const cartReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("addToCart", (state, action) => {
        const item = action.payload;
        // check if the item is already in the cart or not
        const isItemExists = state.cart.find((i) => i._id === item._id); 
        if(isItemExists){
            // item already in cart — replace it (e.g. to update qty) instead of duplicating
            return {
                ...state,
                // cart: [...state.cart, item],
                cart: state.cart.map((i) => (i._id === isItemExists._id ? item : i)),
            };
        }else{
            // brand new item — actually add it
        return {
            ...state,
            cart: [...state.cart, item],
        }; 
        }
    })
    .addCase("removeFromCart", (state, action) => {
       return {
        ...state, 
        cart: state.cart.filter((i) => i._id !== action.payload)
       };
    })
})