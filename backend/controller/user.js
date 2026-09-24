const express = require("express");
const router = express.Router();
const User = require("../model/user")
const {upload} = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const  jwt  = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

//upload.single("file"): accept one uploaded file. multer stores it as a buffer and attaches it to req.file.
router.post("/create-user", upload.single("file"), async(req, res, next) => {
    try {
        const {name, email, password} = req.body;

        const userEmail = await User.findOne({email});
        if(userEmail) {
            return next(new ErrorHandler("User already exists.", 400));
        }

        const result = await uploadToCloudinary(req.file.buffer, "avatars");

        const user = {
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        };
        
        const activationToken = createActivationToken(user);
        // const activationUrl = `http://localhost:3000/activation/${activationToken}`;
        const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
        const activationUrl = `${FRONTEND_URL}/activation/${activationToken}`;

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
        expiresIn : "5m" // expire remains in payload with user
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
        if(!email || !password) return next(new ErrorHandler("Please provide the all fields", 400));

        const user = await User.findOne({email}).select("+password");
        if(!user) return next(new ErrorHandler("User doesn't exist", 400));

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) return next(new ErrorHandler("Please provide the correct information", 400)); //comparePassword function is created in model/user

        sendToken(user, 201, res); //sendToken is a utility function
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}));

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
}));

//log out
router.get("/logout",isAuthenticated, catchAsyncErrors(async(req, res, next) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
    });
    res.status(201).json({
        success: true,
        message: "Logout Successfully!"
    })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))     
    }
}));

//update user info
router.put("/update-user-info", isAuthenticated, catchAsyncErrors(async(req, res, next) => {
    try {
        const { email, password, phoneNumber, name} = req.body;
        const user = await User.findOne({email}).select("+password");
        
        if(!user) {
            return  next(new ErrorHandler("User not found!", 400));  
        }
        
        const isPasswordValid = await user.comparePassword(password);
        
        if(!isPasswordValid){
            return  next(new ErrorHandler("Please provide the correct information", 500)); 
        }

        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        
        await user.save();

        return res.status(201).json({
            success: true,
            user,
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));  
    }
}));

//update user avatar
router.put("/update-avatar", isAuthenticated, upload.single("image"), catchAsyncErrors(async(req, res, next) => {
    try {
        //we are accessing previous user bcz we need to delete the previous avatar of user from uploads folder
        const existUser = await User.findById(req.user.id); // we are using isAuthenticated, taht's why we can access req.user.id otherwise it returns undefined

        if(!existUser) return next(new ErrorHandler("User not found", 404));

        if(existUser?.avatar?.public_id){
            await cloudinary.uploader.destroy(existUser.avatar.public_id);
        }

        const result = await uploadToCloudinary(req.file.buffer, "avatars");

        const user = await User.findByIdAndUpdate(req.user.id, {
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            }}, 

            //By default, findByIdAndUpdate() returns the old document.
            // { new: true } tells Mongoose to return the updated document.
            
            {new: true}
        );

        res.status(200).json({
            success:true,
            user,
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));      
    }
}));

// update user address
router.put("/update-user-addresses", isAuthenticated, catchAsyncErrors(async(req, res, next) => {
    try {
        // finding the logged-in user in MongoDB using their id
        const user = await User.findById(req.user.id);
        const sameTypeAddress = user.addresses.find((address) => address.addressType === req.body.addressType);
        if(sameTypeAddress) return next(new ErrorHandler(`${req.body.addressType} address already exists`));
        
        // checking whether the frontend sent an _id that matches an old address
        const existAddress = user.addresses.find(address => address._id === req.body._id);

        if(existAddress){
            //it copies all properties from req.body into existAddress, overwriting any that already exist. This updates the existing address with the new data.
            Object.assign(existAddress, req.body); //Object.assign(target, source);
        }else{
            // add the new address to the array
            user.addresses.push(req.body);
        }
        await user.save();
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));  
    }
}));

//delete user address
router.delete("/delete-user-addresses/:id", isAuthenticated, catchAsyncErrors( async (req, res, next) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.id;

        //$pull is a special MongoDB operator (not plain JavaScript — it's part of MongoDB's own update syntax) used specifically to remove item(s) from an array field, based on a condition you give it.
        
        // "Find the User with this _id. Inside their addresses array, find the specific address object whose _id matches addressId, and remove just that one object from the array."

        await User.updateOne({
            _id: userId,
        }, {$pull: {addresses: {_id: addressId}}})
        
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));  
    }
}));

// update user password
router.put("/update-user-password", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if(!isPasswordMatched) return next(new ErrorHandler("Old password is incorrect!", 400));      
        if(req.body.newPassword !== req.body.confirmPassword) return next(new ErrorHandler("Password doesn't matched with each other", 400));  
        user.password = req.body.newPassword;
        user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        })
    } catch (error) {
    return next(new ErrorHandler(error.message, 500));      
    }
}));

//find user info with userId for message list
router.get("/user-info/:id", catchAsyncErrors(async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(201).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));   
    }
}))

module.exports = router;

/*
===============================================================================
CONTROLLER/USER.JS NOTES
===============================================================================






===============================================================================
WHY CREATE ACTIVATION TOKEN?
===============================================================================

Since user is not yet stored in MongoDB,

we need somewhere to temporarily keep the user information.

Instead of saving into database,

the backend stores the user object inside a JWT.

createActivationToken(user)

↓

jwt.sign(user, ACTIVATION_SECRET)

↓

Returns:

eyJhbGciOiJIUzI1NiIs...


This token contains:

{
    name,
    email,
    password,
    avatar,
    iat,
    exp
}




===============================================================================
FRONTEND + BACKEND ACTIVATION FLOW
===============================================================================

BACKEND

Create user object
        |
        ▼
Create activation JWT
        |
        ▼
Send activation email

-------------------------------------

USER

Clicks activation link

http://localhost:3000/activation/ABC123XYZ

-------------------------------------

FRONTEND

React Router

<Route
 path="/activation/:activation_token"
/>

↓

useParams()

↓

activation_token = "ABC123XYZ"

↓

axios.post(
    /user/activation
)

Body:

{
 activation_token
}

-------------------------------------

BACKEND

Receives activation_token

↓

jwt.verify()

↓

Extract user information

↓

User.create()

↓

User saved into MongoDB

↓

Generate Login JWT

↓

Send Cookie


===============================================================================
IMPORTANT CONFUSION 
Why do we check "user already exists" in both create-user and activation?
===============================================================================

Step-by-step story
1. Person A submits the signup form with email asma@example.com.
create-user route runs. It checks: "does asma@example.com already exist in the database?" — No. Good, continue.
2. The server does not save the user in the database yet! It only creates an activationToken (a JWT containing the user's info) and emails an activation link to them.
3. At this point, the user is NOT in the database at all. They only exist as data hidden inside that email link.
4. Why can duplicates still happen?

Scenario A — Two signups before activation:

1. Person A signs up with asma@example.com → gets an activation email → doesn't click it yet.
2. Meanwhile, Person A (or someone else) signs up again with the same email asma@example.com.
3. In create-user, the check User.findOne({email}) still finds nothing, because the first signup was never saved to the database — it's just sitting as an unclicked email link!
4. So now two activation emails exist, both valid for 5 minutes, both containing user data for the same email.

Scenario B — Clicking activation twice, or two tokens both valid:

1. Person A clicks the first activation email → activation route runs → checks User.findOne({email}) → not found → creates the user in DB successfully.
2. Now Person A (by mistake, or because they had two tabs open) clicks the second activation email (from the duplicate signup in Scenario A) too.
3. Without the check in activation, this would try to User.create(...) again with the same email — creating a duplicate account, or causing a MongoDB error if email has a unique index.

So, in short:

- In create-user:	Stops someone from signing up again with an email that is already a real, saved account in the database
- In activation:	Stops duplicate saving when someone clicks an old/duplicate activation link, since between signup and activation, the same email could have been used to sign up more than once, or the same link clicked twice

===============================================================================
GET USER (USER PERSISTENCE)
===============================================================================

Purpose:

Keeps user logged in after page refresh.

Problem:

React state is cleared after refresh.

Example:

Before Refresh

user = {
 name:"Asma"
}

After Refresh

user = null

Browser STILL has the authentication cookie.

React asks backend:

GET /user/getuser

Browser automatically sends cookie.

Backend:

Cookie

↓

isAuthenticated

↓

jwt.verify()

↓

Find user

↓

Return user

React stores user again.

User appears logged in again.


===============================================================================
IMPORTANT CONFUSION #4
How does user persistence work?
===============================================================================

User persistence DOES NOT mean

saving user in MongoDB.

User is already stored in MongoDB.

Persistence means:

Keeping the user logged in across page refreshes or browser restarts (until the cookie expires).

Flow:

Login

↓

Cookie Stored

↓

Refresh Page

↓

React state lost

↓

React calls /getuser

↓

Cookie sent automatically

↓

Backend verifies cookie

↓

Returns user

↓

React restores user state


===============================================================================
IMPORTANT CONFUSION #5
How does /getuser know which user?
===============================================================================

Request

↓

Cookie

↓

isAuthenticated

↓

jwt.verify()

↓

decoded.id

↓

User.findById(decoded.id)

↓

req.user

↓

Controller returns user


The browser identifies itself by sending the JWT cookie.
The backend extracts the user's ID from that JWT and fetches the corresponding user from MongoDB.


===============================================================================
WHERE IS /getuser CALLED?
===============================================================================

Usually inside frontend:

useEffect()

Redux Action

Context Provider

App.jsx

Search frontend for:

getuser

or

loadUser

or

/user/getuser

or

axios.get(...)

Example:

useEffect(()=>{
    axios.get(
        `${server}/user/getuser`,
        {
            withCredentials:true
        }
    );
},[]);


===============================================================================
IMPORTANT
===============================================================================

Authentication Cookie

↓

Browser automatically sends it with every request

ONLY IF

Frontend request contains:

withCredentials: true

and

Backend CORS contains:

credentials: true

Without these,

req.cookies.token

will be undefined.
===============================================================================*/