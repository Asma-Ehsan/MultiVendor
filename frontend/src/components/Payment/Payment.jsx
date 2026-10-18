import { useEffect, useState } from "react";
import CartData from "./CartData/CartData";
import PaymentInfo from "./PaymentInfo/PaymentInfo";
import {
  CardNumberElement, //is used later to find the card number box.
  useElements, //gives you the card boxes on the screen.
  useStripe, //gives you the Stripe tool.
} from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false); //says if the PayPal popup is open

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe(); //gives you the Stripe tool.
  const elements = useElements(); //elements are the Stripe tools.

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  // data and actions are given by PayPal.
  const createOrder = (data, actions) => {
    // actions.order.create(...) tells PayPal: "A customer wants to pay this amount."
    return actions.order
      .create({
        // It is the list of things being bought.
        purchase_units: [
          {
            description: "E-shop order", //text PayPal shows the customer
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderId) => {
        // PayPal gives back an order ID. We return it, and PayPal uses it to open its login popup.
        return orderId;
      });
  };

  const onApprove = async (data, actions) => {
    // actions.order.capture() takes the money.
    return actions.order.capture().then(
      // .then(function (details) {...}) runs when the capture finishes. details has all the payment information.
      function (details) {
      const { payer } = details;
      let paymentInfo = payer; //takes out only the payer part. It has the buyer's name, email and payer_id.

      // "only continue if we really got payer info."
      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo); //is our own function that saves the order.
      }
    });
  };

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    // This is what we send to the backend for Stripe.
    // Stripe wants the amount in the smallest money unit (cents or paise), not in full units. So $80 becomes 8000. That's why we multiply by 100.

    amount: Math.round(orderData?.totalPrice * 100),
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  // payment with credit card using Stripe
  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        paymentData,
        config,
      );

      const client_secret = data.client_secret;

      // If Stripe hasn't loaded yet, stop here.
      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        // We also point to the card box with elements.getElement(CardNumberElement).
        // Stripe reads the card details by itself and tries to charge the card.
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });
      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };
          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order successful!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    order.paymentInfo = {
      status: "succeeded",
      type: "Cash in Delivery",
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

// Everything above it (useState, useEffect, handlers, etc.) stays the same.
return (
  <div className="w-full font-jakarta">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: payment methods */}
        <div className="lg:col-span-8">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>

        {/* Right column: order summary */}
        <div className="lg:col-span-4">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  </div>
);
};
export default Payment;