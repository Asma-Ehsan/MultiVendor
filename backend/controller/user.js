const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user")
const {upload} = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const  jwt  = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");


//upload.single("file"): accept one uploaded file
router.post("/create-user", upload.single("file"), async(req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const userEmail = await User.findOne({email});
        if(userEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(err);
                    // res.status(500).json({message: "Error deleting file"});
                }
            })
         
            return next(new ErrorHandler("User already exists.", 400));
        }

        const filename = req.file.filename;
        const fileUrl = `http://localhost:8000/uploads/${filename}`;

        const user = {
            name,
            email,
            password,
            avatar: {
                public_id: filename,
                url: fileUrl,
            },
        };
        
        const activationToken = createActivationToken(user);
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        //this try-catch is for send mail
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account", 
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`
            })
            
            res.status(201).json({
                success: true,
                message: `Please check your email: -${user.email} to activate your account`
            })
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
       
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

//create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn : "5m"
    })
};

//activate user 
router.post("/activation", catchAsyncErrors(async(req, res, next) => {
    try {
        const {activation_token} = req.body;

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if(!newUser){
            return next(new ErrorHandler("Invalid token", 400));
        }
        const {name, email, password, avatar} = newUser;
        let user = await User.findOne({email});
        if(user){
            return next(new ErrorHandler("User already exists", 400));
        }
        user = await User.create({
            name,
            email,
            avatar,
            password,
        });
        sendToken(user, 201, res)
    } catch (error) {
       return next(new ErrorHandler(error.message, 500));
    }
}));

//login user
router.post("/login-user", catchAsyncErrors(async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) return next(new ErrorHandler("Please provide the all fileds", 400));

        const user = await User.findOne({email}).select("+password");
        if(!user) return next(new ErrorHandler("User doesn't exist", 400));

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) return next(new ErrorHandler("Please provide the correct information", 400)); //comparePassword function is created in model/user

        sendToken(user, 201, res); //sendToken is a utility function
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))

//load user (user persistence)
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if(!user) return next(new ErrorHandler("User does not exist", 500));
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))

//log out
router.get("/logout",isAuthenticated, catchAsyncErrors(async(req, res, next) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
    });
    res.status(201).json({
        success: true,
        message: "Logout Successfully!"
    })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))     
    }
}))

module.exports = router;