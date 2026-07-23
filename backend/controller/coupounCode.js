const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const fs = require("fs");

const express = require("express");
const CoupounCode = require("../model/coupounCode");
const router = express.Router();

//create coupounCode
router.post("/create-coupoun-code", isSeller, catchAsyncError(async(req, res, next) => {
    try {
        const isCoupounCodeExists = await CoupounCode.find({name: req.body.name});

        if(isCoupounCodeExists) return next(new ErrorHandler("Coupoun Code already exists!", 400));

        const coupounCode = await CoupounCode.create(req.body);

        res.status(201).json({
            success: true,
            coupounCode,
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))