const catchAsyncError = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const Event = require("../model/event");
const { isSeller } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

const express = require("express");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
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
        if (!files || files.length === 0) {
          return next(new ErrorHandler("Please upload at least one image", 400));
        }

        const imageUrls = [];

        for(const file of files){
          const result = await uploadToCloudinary(file.buffer, "events");

          imageUrls.push({
            public_id: result.public_id,
            url: result.secure_url,
          })
        }
  

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

//get all events 
router.get("/get-all-events", catchAsyncError(async(req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
}))

// get all products of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

//delete product of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const productId = req.params.id;

      const eventData = await Event.findById(productId);
      
      for(const image of eventData.images){
        await cloudinary.uploader.destroy(image.public_id);
      }

      const event = await Event.findByIdAndDelete(productId);

      if (!event)
        return next(new ErrorHandler("Event not found with this id!", 500));


      res.status(201).json({
        success: true,
        message: "Event deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
