const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");

const express = require("express");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

//create coupounCode
router.post("/create-coupoun-code", isSeller, catchAsyncError(async(req, res, next) => {
    try {
        const isCoupounCodeExists = await CoupounCode.find({name: req.body.name});

        if(isCoupounCodeExists.length !== 0) return next(new ErrorHandler("Coupoun Code already exists!", 400));

        const coupounCode = await CoupounCode.create(req.body);

        res.status(201).json({
            success: true,
            coupounCode,
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

//get all coupons of a shop
router.get("/get-coupon/:id", isSeller, catchAsyncError(async(req,res,next) => {
    try {
        const couponCodes = await CoupounCode.find(
            {
                shopId: req.seller.id,//in DB we have a shop object and inside shop object we have id
        }); // if we use findById(req.params.id) then it"ll send object and find({id: req.params.id}) will send an array and we need array

        res.status(201).json({
            success: true,
            couponCodes,
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

//get coupon code value by its name 
router.get("/get-coupon-value/:name", catchAsyncError(async(req,res,next) => {
    try {
       const couponCode = await CoupounCode.findOne({name: req.params.name});
       res.status(201).json({
        success: true,
        couponCode
       })
    } catch (error) {
         return next(new ErrorHandler(error, 400));
    }
}))

module.exports = router