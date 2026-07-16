//This is an arrow function returning another arrow function.
module.exports = (theFunc) => (req,res,next) => { 
    Promise.resolve(theFunc(req,res,next)).catch(next);
};

/*
catchAsyncError - Notes

PURPOSE:
This file is a wrapper for async Express route handlers.
It removes the need to write try-catch in every controller.

HOW IT WORKS (FLOW):
1. You pass an async function (theFunc) to this wrapper
2. It returns a new middleware function (req, res, next)
3. That function runs your original function safely
4. If anything goes wrong, error is automatically sent to Express error handler using next()

KEY IDEA 1 - HIGHER ORDER FUNCTION:
- It is a function that takes another function as input
- It returns a new function
- Used here to wrap controllers

Example:
catchAsyncError(controllerFunction)

KEY IDEA 2 - PROMISE WRAPPING:
Promise.resolve(theFunc(req,res,next))

WHY THIS IS USED:
- Ensures even normal functions behave like promises
- Makes sure .catch() always works safely
- Prevents crashes if function is not async

KEY IDEA 3 - ERROR HANDLING:
.catch(next)

Meaning:
- If any error occurs, pass it to Express using next(error)
- That sends it to global error handler middleware

FINAL FLOW:
Controller → Wrapper → Promise runs → success OR error → error goes to global handler

WHY WE USE THIS:
- No repeated try-catch blocks
- Cleaner controllers
- Centralized error handling
*/