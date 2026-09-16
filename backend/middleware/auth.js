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

/*
                    JWT
                     ↓
              jwt.verify()
               ↙         ↘
       Secret key        Payload
           ↓                ↓
   Is JWT genuine?       Who is user?
           ↓                ↓
          YES          decoded.id

*/

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

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

Think of your JWT as a **sealed ID card**.

When the user logs in, your application creates a token containing the user's ID:

JWT token
   ↓
contains user ID
   ↓
{id: "687123abc"}

Later, the user makes another request, and that JWT comes from the cookie:

const { token } = req.cookies;

Now you need to check:

> "Is this token actually valid, and what user ID is inside it?"

That's what this does:

jwt.verify(token, process.env.JWT_SECRET_KEY)

It verifies the token using your secret key.

If the token is valid, it gives you the information stored inside the token.

So:

const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

means:

> **"Verify this token, and give me the information inside it. Store that information in `decoded`."**

For example:

token
  ↓
jwt.verify()
  ↓
decoded
  ↓
{
   id: "687123abc",
   iat: ...,
   exp: ...
}

Therefore:

decoded.id

gives:

"687123abc"

---

# Second line

Now you have the user's ID:

decoded.id

But you don't have the **actual user document** yet.

So you use that ID to find the user in MongoDB:

req.user = await User.findById(decoded.id);

Think of it like this:

decoded.id
    ↓
"687123abc"
    ↓
User.findById("687123abc")
    ↓
MongoDB
    ↓
User document

MongoDB might return:

{
    _id: "687123abc",
    name: "Asma",
    email: "asma@gmail.com"
}

And this entire user object is stored in:

req.user

So now:

req.user

contains the logged-in user's information.

---

# Why are these two lines together?

This is the most important part.

### Line 1 finds out WHO the user is

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
```

It gets the user's **ID from the JWT**.

### Line 2 gets that user's information

```js
req.user = await User.findById(decoded.id);
```

It uses that ID to **find the user in MongoDB**.

So the complete process is:

```text
Cookie
  ↓
JWT token
  ↓
jwt.verify()
  ↓
decoded
  ↓
decoded.id
  ↓
User.findById(decoded.id)
  ↓
User document
  ↓
req.user
```

### In one simple sentence:

> **`jwt.verify()` tells us which user the token belongs to, and `User.findById()` gets that user's actual information from MongoDB and puts it in `req.user`.**

---

### Why not just use `decoded`?

Because `decoded` only contains the information stored in the JWT, mainly the user's ID in your case:

```js
decoded = {
    id: "687123abc",
    iat: ...,
    exp: ...
}
```

Your MongoDB user document can contain much more:

```js
req.user = {
    _id: "687123abc",
    name: "Asma",
    email: "asma@gmail.com",
    role: "user",
    // other user fields...
}
```

So your authentication middleware essentially does:

**JWT → user ID → database user → `req.user` → controller**

And that is exactly what those two lines in your notes are trying to explain.

-------------------------------------------

The flow is:

JWT from cookie
      ↓
jwt.verify(token, SECRET_KEY)
      ↓
Check JWT is genuine
      ↓
Decode JWT
      ↓
decoded.id
      ↓
"687123abc"
      ↓
User.findById("687123abc")
      ↓
MongoDB
      ↓
Actual user document
      ↓
req.user
The whole concept in one picture
LOGIN
  │
  │ user._id = "687123abc"
  ↓
jwt.sign(
   { id: "687123abc" },       ← WHO is the user
   JWT_SECRET_KEY             ← secret used to sign/protect
)
  │
  ↓
JWT
  │
  ↓
Browser Cookie
  │
  │ later request
  ↓
Backend
  │
  ↓
jwt.verify(token, JWT_SECRET_KEY)
  │
  ├── Secret key → verifies JWT is genuine
  │
  └── Payload → gives user ID
                    ↓
                decoded.id
                    ↓
          User.findById(decoded.id)
                    ↓
              MongoDB user
                    ↓
                 req.user
The key thing to remember

User ID answers: "WHO is this token for?"

Secret key answers: "CAN I TRUST this token?"

----------------------------------------------------

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
