import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, ShopCreatePage, SellerActivationPage, ShopLoginPage } from "./routes/Routes.js";
import {ShopDashboardPage} from "./routes/ShopRoutes"
import {ToastContainer} from 'react-toastify';
import Store from "./redux/stores";
import {loadSeller, loadUser} from "./redux/actions/user"
import ProtectedRoute from "./routes/ProtectedRoute.js";
import {ShopHomePage} from "./ShopRoutes.js"
import SellerProtectedRoute from "./routes/SellerProtectedRoute"

const App = () => {
  useEffect(() => {
   Store.dispatch(loadUser());
   Store.dispatch(loadSeller());
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
        <Route path="/product/:name" element={<ProductDetailsPage/>}/>
        <Route path="/best-selling" element={<BestSellingPage/>}/>
        <Route path="/events" element={<EventsPage/>}/>
        <Route path="/faq" element={<FAQPage/>}/>
        {/* <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage/>
          </ProtectedRoute>
        }/> */}
        {/* Payment Page  */}
        {/* Order Success Page */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        }/>
        
        {/* shop Routes */}

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
