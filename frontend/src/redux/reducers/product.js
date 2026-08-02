import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isLoading : true,
    product: [],
}

export const productReducer = createReducer(initialState, (builder) => {
    builder
    .addCase("productCreateRequest", (state) => {
        state.isLoading = true;
    })
    .addCase(
        "productCreateSuccess", (state, action) => {
            state.isLoading = false;
            state.product = action.payload; //state.product means our data in actions
            state.success = true;
        },
    )
    
    .addCase(
        "productCreateFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        },
    )

    //get all products of shop
    .addCase(
        "getAllProductsShopRequest", (state) => {
            state.isLoading = true;
        },
    )
    .addCase(
        "getAllProductsShopSuccess", (state, action) => {
            state.isLoading = false;
            state.products = action.payload; //state.product means our data in actions
            // state.success = true;
        },
    )
    .addCase(
        "getAllProductsShopFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload; //state.product means our data in actions
            // state.success = false;
        },
    )

    //delete product of a shop
    .addCase(
        "deleteProductRequest", (state) => {
            state.isLoading = true;
        },
    )
    .addCase(
        "deleteProductSuccess", (state, action) => {
            state.isLoading = false;
            state.message = action.payload; //message will come in res of delete controller
        },
    )
    .addCase(
        "deleteProductFailed", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    )

     //get all products
     .addCase(
        "getAllProductsRequest", (state) => {
            state.isLoading = true;
        },
    )
    .addCase(
        "getAllProductsSuccess", (state, action) => {
            state.isLoading = false;
            state.allProducts = action.payload; //state.product means our data in actions
            // state.success = true;
        },
    )
    .addCase(
        "getAllProductsFailed", (state, action) => {
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