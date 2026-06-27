const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isSeller } = require("../middleware/auth");
const  jwt  = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Shop = require("../model/shop");
const {upload} = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

router.post("/create-shop", upload.single("file"), async(req, res, next) => {
    try {
        const {email} = req.body;
        const sellerEmail = await Shop.findOne({email});
        if(sellerEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(err);
                    // res.status(500).json({message: "Error deleting file"});
                }
            })
         
            return next(new ErrorHandler("Seller already exists.", 400));
        }
        const filename = req.file.filename;
        const fileUrl = `http://localhost:8000/uploads/${filename}`;

        const seller = {
            name: req.body.name,
            email: email,
            password : req.body.password,
            avatar: {
                public_id: filename,
                url: fileUrl,
            },
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            zipCode: req.body.zipCode,
        };

        const activationToken = createActivationToken(seller);
        const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

          //this try-catch is for send mail
          try {
            await sendMail({
                email: seller.email,
                subject: "Activate your Shop", 
                message: `Hello ${seller.name}, please click on the link to activate your shop: ${activationUrl}`
            })
            
            res.status(201).json({
                success: true,
                message: `Please check your email: -${seller.email} to activate your shop`
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
})

//create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn : "5m"
    })
};

//activate seller
router.post("/activation", catchAsyncErrors(async(req, res, next) => {
    try {
        const {activation_token} = req.body;

        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if(!newSeller){
            return next(new ErrorHandler("Invalid token", 400));
        }
        const {name, email, password, avatar, zipCode, address, phoneNumber} = newSeller;
        let seller = await Shop.findOne({email});
        if(seller){
            return next(new ErrorHandler("Seller already exists", 400));
        }
        seller = await Shop.create({
            name,
            email,
            avatar,
            password,
            zipCode,
            address,
            phoneNumber,
        });
        sendShopToken(seller, 201, res)
    } catch (error) {
       return next(new ErrorHandler(error.message, 500));
    }
}));

//login shop
router.post("/login-shop", catchAsyncErrors(async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return next(new ErrorHandler("Please provide the all fileds", 400));

        const user = await Shop.findOne({email}).select("+password");
        if(!user) return next(new ErrorHandler("User doesn't exist", 400));

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) return next(new ErrorHandler("Please provide the correct information", 400)); //comparePassword function is created in model/user

        sendShopToken(user, 201, res); //sendToken is a utility function
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}));

//load shop (user persistence)
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        
        const seller = await Shop.findById(req.seller._id);
        if(!seller) return next(new ErrorHandler("Seller does not exist", 500));
        res.status(200).json({
            success: true,
            seller,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))



module.exports = router;