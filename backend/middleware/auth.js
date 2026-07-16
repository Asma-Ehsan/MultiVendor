const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/user")
const Shop = require("../model/shop")

exports.isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    /*It is object destructuring. 
    Equivalent to: 
    const token = req.cookies.token; */
    const {token} = req.cookies; 
    if(!token) return next(new ErrorHandler("Please login to continue", 401)); 

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
})

exports.isSeller = catchAsyncErrors(async(req, res, next) => {
    const {seller_token} = req.cookies;
    if(!seller_token) return next(new ErrorHandler("Please login to continue", 401));

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
    req.seller = await Shop.findById(decoded.id);
    next();
})

/*
===========================================
jwt.verify()
===========================================

Code:

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

Purpose:
- Verifies whether the JWT token is valid.
- Checks:
  1. Is the token signed with the correct secret key?
  2. Has the token been modified?
  3. Has the token expired?

If any check fails:
- jwt.verify() throws an error.

If all checks pass:
- It returns the decoded payload stored inside the token.

-------------------------------------------

During Login:

The token was created using:

jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    {
        expiresIn: process.env.JWT_EXPIRES
    }
)

Payload stored inside JWT:

{
    id: "687123abc"
}

JWT automatically adds:

{
    id: "687123abc",
    iat: 1752650000, -- issued At (added automatically)
    exp: 1753254800
}

-------------------------------------------

Later, during authentication:

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

Returns:

{
    id: "687123abc",
    iat: 1752650000,
    exp: 1753254800
}

Therefore:

decoded.id

returns:

"687123abc"

===========================================
req.user = await User.findById(decoded.id)
===========================================

Code:

req.user = await User.findById(decoded.id);

Purpose:
- Uses the user id stored inside the decoded JWT.
- Searches MongoDB for that user.
- Stores the complete user document inside req.user.

Example:

decoded = {
    id: "687123abc"
}

So,

User.findById(decoded.id)

becomes:

User.findById("687123abc")

MongoDB returns:

{
    _id: "687123abc",
    name: "Asma",
    email: "asma@gmail.com"
}

Now,

req.user = {
    _id: "687123abc",
    name: "Asma",
    email: "asma@gmail.com"
}

-------------------------------------------

Why store it in req.user?

The req (request) object is shared between all middleware and controllers handling the same request.

By attaching the user to req.user, every next middleware or controller can access the logged-in user's information.

Example:

Middleware:

req.user = await User.findById(decoded.id);

Next Controller:

console.log(req.user);

Output:

{
    _id: "687123abc",
    name: "Asma",
    email: "asma@gmail.com"
}

-------------------------------------------

What if we write:

const user = await User.findById(decoded.id);

instead of:

req.user = await User.findById(decoded.id);

Then:

- user becomes a local variable.
- It is available only inside the current middleware.
- After the middleware finishes, the variable is destroyed.
- The next middleware or controller cannot access it.

Therefore, storing the user in req.user makes it available throughout the entire request lifecycle.

===========================================
Authentication Flow

Login
   |
   ▼
jwt.sign({ id: user._id })
   |
   ▼
JWT Stored in Cookie
   |
   ▼
Next Request
   |
   ▼
jwt.verify(token)
   |
   ▼
decoded.id
   |
   ▼
User.findById(decoded.id)
   |
   ▼
req.user
   |
   ▼
Next Middleware / Controller
===========================================
*/
