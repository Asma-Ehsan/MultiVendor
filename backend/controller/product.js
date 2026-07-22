const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const {upload} = require("../multer");


//create product
router.post("/create-product", upload.array("images"), catchAsyncError(async(req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if(!shopId) return next(new ErrorHandler("Shop Id is invalid!", 400));
        else{
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;
            
            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product
            })
        }
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))

// get all products of a shop
router.get("/get-all-products-shop/:id", catchAsyncError(async(req, res, next) => {
    try {
        const products = await Product.find({shopId: req.params.id});
       
        res.status(201).json({
            success: true,
            products,
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))

//

module.exports = router;