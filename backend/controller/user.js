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

/*
===============================================================================
CONTROLLER/USER.JS NOTES
===============================================================================

PURPOSE OF controller/user.js
----------------------------

This file contains all user-related routes (controllers).

Examples:
- User Registration
- Email Activation
- Login
- Logout
- Load Current User
- Profile Update
- Password Update
etc.

Flow:

Frontend
    |
    ▼
Route Request
    |
    ▼
controller/user.js
    |
    ├────────► Model (MongoDB)
    ├────────► JWT
    ├────────► Multer
    ├────────► Send Mail
    ├────────► Authentication Middleware
    └────────► Response


===============================================================================
REGISTRATION FLOW (IMPORTANT)
===============================================================================

User fills registration form
        |
        ▼
POST /create-user
        |
        ▼
upload.single("file")
        |
        ▼
Profile Image Saved in uploads/
        |
        ▼
Read req.body
        |
        ▼
Check if email already exists
        |
        ├────────► Yes
        │              |
        │              ▼
        │      Delete uploaded image
        │              |
        │              ▼
        │      Return Error
        │
        ▼ No
Create normal JavaScript user object
        |
        ▼
Create Activation JWT
        |
        ▼
Create Activation URL
        |
        ▼
Send Email
        |
        ▼
Registration finished
(User is NOT saved in MongoDB yet)


===============================================================================
IMPORTANT CONCEPT
User Object is NOT saved yet
===============================================================================

During registration:

const user = {
    name,
    email,
    password,
    avatar
}

This is ONLY a normal JavaScript object.

It is NOT:

❌ MongoDB Document
❌ Mongoose Document

It only exists temporarily in memory.

MongoDB still has NO user.

The actual database insertion happens only after email verification.


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
WHY CREATE ACTIVATION URL?
===============================================================================

activationToken

↓

ABC123XYZ


activationUrl

↓

http://localhost:3000/activation/ABC123XYZ


The email contains this URL.

User clicks this link to verify the account.


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
IMPORTANT CONFUSION #1
How does jwt.verify() work if user is NOT in MongoDB?
===============================================================================

Answer:

jwt.verify() NEVER checks MongoDB.

It only checks the JWT itself.

It performs these checks:

1. Is token signed with correct secret?

2. Has token been modified?

3. Has token expired?

If everything is valid,

it returns the original payload stored inside the JWT.

Example:

jwt.sign(user, SECRET)

↓

Token

↓

jwt.verify(token, SECRET)

↓

Returns:

{
    name,
    email,
    password,
    avatar
}

No database query happens here.


===============================================================================
IMPORTANT CONFUSION #2
Does jwt.verify() compare received token with the original token?
===============================================================================

NO.

Backend NEVER stores the activation token.

After sending the email,

backend forgets the token.

There is NO code like:

savedToken = activationToken

or

ActivationToken.create(...)

Nothing is stored.

Instead,

jwt.verify()

recalculates the token signature using the same secret.

If calculated signature matches the signature inside token,

the token is authentic.

Otherwise,

verification fails.


===============================================================================
JWT SIGNATURE FLOW
===============================================================================

jwt.sign(user, SECRET)

↓

Payload
+
SECRET

↓

Digital Signature Created

↓

Token Sent

--------------------------------

Later

jwt.verify(token, SECRET)

↓

Extract Payload

↓

Recalculate Signature

↓

Signature Matches?

YES

↓

Return Payload

NO

↓

Throw Error


===============================================================================
IMPORTANT CONFUSION #3
Why check User.findOne(email) AFTER jwt.verify()?
===============================================================================

jwt.verify()

DOES NOT check database.

It only verifies JWT.

After verification,

backend manually checks MongoDB:

User.findOne({email})

Purpose:

To make sure user doesn't already exist.

This is completely separate from JWT verification.


===============================================================================
ACTIVATION ROUTE
===============================================================================

POST /user/activation

Purpose:

1. Receive activation token

2. Verify token

3. Extract user information

4. Check duplicate email

5. Save user into MongoDB

6. Automatically login user

7. Send login JWT cookie


===============================================================================
TWO DIFFERENT JWT TOKENS
===============================================================================

1)

Activation JWT

Created By:

createActivationToken()

Purpose:

Temporarily stores user information until email verification.

Lifetime:

5 Minutes

--------------------------------------------------

2)

Login JWT

Created By:

user.getJwtToken()

inside

sendToken()

Purpose:

Keeps user logged in.

Stored inside cookies.

Lifetime:

JWT_EXPIRES (7d in this project)


These are TWO completely different JWTs.


===============================================================================
catchAsyncErrors vs try-catch
===============================================================================

catchAsyncErrors

already catches rejected promises and thrown errors.

Example:

router.post(
    "...",
    catchAsyncErrors(async(...)=>{

    })
)

Inside this async function,

errors are automatically forwarded to:

next(error)

↓

middleware/error.js


Therefore,

using another

try{

}
catch(){

}

inside the same function is generally redundant.

Many developers either:

✔ use catchAsyncErrors

OR

✔ use try-catch

Using both usually isn't necessary.

In this project,

the author used both, but catchAsyncErrors alone would be enough.


===============================================================================
LOGIN
===============================================================================

Login Flow

Email + Password

↓

Find User

↓

comparePassword()

↓

Generate Login JWT

↓

Store Cookie

↓

User Logged In


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


===============================================================================
FILES CONNECTED TO controller/user.js
===============================================================================

controller/user.js

│

├──── model/user.js
│      Database operations
│
├──── multer.js
│      Upload images
│
├──── sendMail.js
│      Send activation email
│
├──── jwtToken.js
│      Create login JWT + cookie
│
├──── auth.js
│      Verify login cookie
│
├──── ErrorHandler.js
│      Create custom errors
│
├──── catchAsyncErrors.js
│      Catch async errors
│
└──── error.js
       Sends error response

===============================================================================*/