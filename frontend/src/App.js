import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, ShopCreatePage, SellerActivationPage, ShopLoginPage, CheckoutPage, PaymentPage} from "./routes/Routes.js";
import {ShopDashboardPage, ShopCreateProduct, ShopAllProduct, ShopCreateEvents, ShopAllEvents, ShopAllCoupouns, ShopPreviewPage,} from "./routes/ShopRoutes"
import {ToastContainer} from 'react-toastify';
import Store from "./redux/stores";
import {loadSeller, loadUser} from "./redux/actions/user"
import ProtectedRoute from "./routes/ProtectedRoute.js";
import {ShopHomePage} from "./ShopRoutes.js"
import SellerProtectedRoute from "./routes/SellerProtectedRoute"
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";

const App = () => {
  useEffect(() => {
   Store.dispatch(loadUser());
   Store.dispatch(loadSeller());
   Store.dispatch(getAllProducts());
   Store.dispatch(getAllEvents());
  },[])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route path="/products" element={<ProductsPage/>}/>
        <Route path="/product/:id" element={<ProductDetailsPage/>}/>
        <Route path="/best-selling" element={<BestSellingPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/faq" element={<FAQPage/>}/>
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage/>
          </ProtectedRoute>
        }/>
        {/* Payment Page  */}
         <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
            />
        {/* Order Success Page */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        }/>
        
        {/* shop Routes */}

        <Route path="/shop/preview/:id" element = {<ShopPreviewPage/>}/>
        <Route path="/shop-create" element={<ShopCreatePage/>}/>
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/shop-login" element={<ShopLoginPage/>}/>
        <Route path="/shop/:id" element={
          <SellerProtectedRoute>
            <ShopHomePage/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard" element={
          <SellerProtectedRoute>
            <ShopDashboardPage/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard-create-product" element={
          <SellerProtectedRoute>
            <ShopCreateProduct/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard-products" element={
          <SellerProtectedRoute>
            <ShopAllProduct/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard-create-event" element={
          <SellerProtectedRoute>
            <ShopCreateEvents/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard-events" element={
          <SellerProtectedRoute>
            <ShopAllEvents/>
          </SellerProtectedRoute>
        }/>
        <Route path="/dashboard-coupouns" element={
          <SellerProtectedRoute>
            <ShopAllCoupouns/>
          </SellerProtectedRoute>
        }/>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
