const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//This starts Stripe on the backend with your secret key.
router.post("/process", catchAsyncError(async (req, res, next) => {
  // This tells Stripe: "A customer wants to pay this amount." Stripe creates a payment intent (a payment plan)
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "E-shop",
      },
    });
    res.status(201).json({
      success: true,
      client_secret: myPayment.client_secret, //Stripe gives back a client_secret. the frontend frontend uses this secret to finish the payment with the card details
    });
  }),
);

router.get("/stripeapikey", catchAsyncError(async(req,res,next) => {
    res.status(200).json({
        stripeApikey: process.env.STRIPE_API_KEY,
    })
}))

module.exports = router;