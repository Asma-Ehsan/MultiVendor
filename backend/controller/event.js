const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Event = require("../model/event");

const express = require("express");
const router = express.Router();


//create event
router.post(
    "/create-event",
    upload.array("images"),
    catchAsyncError(async (req, res, next) => {
      try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shopId) return next(new ErrorHandler("Shop Id is invalid!", 400));
        else {
          const files = req.files;
          const imageUrls = files.map((file) => `${file.filename}`);
          
          const eventData = req.body;
          eventData.images = imageUrls;
          eventData.shop = shop;
  
          const product = await Event.create(eventData);
  
          res.status(201).json({
            success: true,
            product,
          });
        }
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }
    })
  );

  module.exports = router;