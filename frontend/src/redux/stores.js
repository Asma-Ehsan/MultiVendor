import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product.js";
import { eventReducer } from "./reducers/event";
import { cartReducer } from "./reducers/cart.js";
import { wishlistReducer } from "./reducers/wishlist.js";

const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default Store;
