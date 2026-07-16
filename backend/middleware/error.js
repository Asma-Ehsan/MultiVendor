const ErrorHandler = require("../utils/ErrorHandler");

//The first parameter is err. This is how Express recognizes it as an error-handling middleware.

module.exports = (err, req, res, next) => {
    //If error has no status code or message, set the following default values.
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // if error have any name or code then check for the following conditions:

    //wrong mongodb id error
    if(err.name == "CastError"){
        const message = `Resources not found with this id... Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //duplicate key error (i.e duplicate email)
    if(err.code === 11000){
        const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400);
    }

    //wrong jwt error
    if(err.name === "JsonWebTokenError"){
        const message = `Your url is invalid. Please try again later!`
        err = new ErrorHandler(message,400);
    }

    //jwt expired
    if(err.name === "TokenExpiredError"){
        const message = `Your url is expired. Please try again later!`
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}


/*
===========================================
Understanding err.path and err.keyValue
===========================================

These properties are NOT created inside error.js.

They are automatically added by Mongoose/MongoDB when an error occurs.
These error objects are automatically created by Mongoose (and sometimes by the MongoDB driver). None of your project files create them.

Express receives the error object through next(err) and passes it to the
global error handling middleware.

Flow:

Database Error
      |
      ▼
Mongoose / MongoDB creates Error Object
      |
      ▼
next(err)
      |
      ▼
middleware/error.js
      |
      ▼
Access properties like:
err.path
err.keyValue

===========================================
1. err.path
===========================================

Used for:

CastError (Invalid MongoDB ObjectId)

Example:

User.findById(req.params.id)

Suppose user sends:

GET /user/abc123

MongoDB expects:

ObjectId

but receives:

abc123

Mongoose cannot convert it into an ObjectId and creates this error object:

{
    name: "CastError",
    message: "Cast to ObjectId failed",
    path: "_id",
    value: "abc123"
}

Here,

err.path

returns:

"_id"

Therefore,

const message =
`Resources not found with this id... Invalid ${err.path}`;

becomes

Resources not found with this id... Invalid _id

-------------------------------------------

Visual Flow

Wrong MongoDB ID
        |
        ▼
Mongoose creates

{
    name:"CastError",
    path:"_id"
}

        |
        ▼
    next(err)

        |
        ▼
    error.js

        |
        ▼
    err.path

        |
        ▼
      "_id"

===========================================
2. err.keyValue
===========================================

Used for:

Duplicate Key Error (Error Code 11000)

Suppose email is unique:

email:{
    type:String,
    unique:true
}

Database already contains:

{
    email:"ali@gmail.com"
}

Another user registers using the same email.

MongoDB rejects it and creates:

{
    code:11000,
    keyValue:{
        email:"ali@gmail.com"
    }
}

Now,

err.keyValue

contains

{
    email:"ali@gmail.com"
}

===========================================
Object.keys()
===========================================

Object.keys() is a JavaScript built-in method.

Purpose:
Returns only the property names (keys) of an object.

Example:

Object.keys({
    email:"abc@gmail.com"
})

Returns:

["email"]

So,

Object.keys(err.keyValue)

returns

["email"]

When used inside a template literal:

`${Object.keys(err.keyValue)}`

JavaScript converts the array into a string: email

Final message: Duplicate key email Entered

===========================================
*/