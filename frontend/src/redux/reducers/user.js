import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("LoadUserFail", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })

        //update user information
        .addCase("UpdateUserInfoRequest", (state) => {
            state.loading = true;
        })
        .addCase("UpdateUserInfoSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase("UpdateUserInfoFail", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // update user address
        .addCase("UpdateUserAddressRequest", (state) => {
            state.addressloading = true;
        })
        .addCase("UpdateUserAddressSuccess", (state, action) => {
            state.addressloading = false;
            state.successMessage = action.payload.successMessage;
            state.user = action.payload.user;
        })
        .addCase("UpdateUserAddressFail", (state, action) => {
            state.addressloading = false;
            state.error = action.payload;
        })

        //delete user address
        .addCase("DeleteUserAddressRequest", (state) => {
            state.addressloading = true;
        })
        .addCase("DeleteUserAddressSuccess", (state, action) => {
            state.addressloading = false;
            state.successMessage = action.payload.successMessage;
            state.user = action.payload.user;
        })
        .addCase("DeleteUserAddressFail", (state, action) => {
            state.addressloading = false;
            state.error = action.payload.user;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        })
        .addCase("clearMessages", (state) => {
            state.successMessage = null;
        })

});


