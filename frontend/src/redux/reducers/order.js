import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading : true,
    orders: [],
}

export const orderReducer = createReducer(initialState, (builder) => {
    builder

    //get all orders of shop
    .addCase(
        "getAllOrdersUserRequest", (state) => {
            state.isLoading = true;
        },
    )
    .addCase(
        "getAllOrdersUserSuccess", (state, action) => {
            state.isLoading = false;
            state.orders = action.payload; //state.product means our data in actions
            // state.success = true;
        },
    )
    .addCase(
        "getAllOrdersUserFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload; //state.product means our data in actions
            // state.success = false;
        },
    )

   .addCase(
    "clearErrors", (state)  => {
        state.error = null;
    }
   )
    
})