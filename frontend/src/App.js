import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { server } from "./server.js";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const App = () => {
  const [stripeApikey, setStripeApikey] = useState("");
  async function getStipeApikey() {
     try {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApikey(data?.stripeApikey || "");
  } catch (error) {
    console.error("Stripe key fetch failed:", error);
  }
  }
  useEffect(() => {
   Store.dispatch(loadUser());
   Store.dispatch(loadSeller());
   Store.dispatch(getAllProducts());
   Store.dispatch(getAllEvents());
   getStipeApikey();
  },[])

  return (
    <BrowserRouter>
    {stripeApikey && (
      <Elements stripe={loadStripe(stripeApikey)}>
        <Routes>
         <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              }
          />
        </Routes>
      </Elements>
    )}
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
