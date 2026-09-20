const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./db/Database");

//app.js loads your environment variables. Now, application can access them through: process.env.PORT
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
}

//creating express app. Now app gives you methods such as: app.use(), app.get(), app.post(), app.listen() etc
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://multi-vendor-m5ay-nine.vercel.app",
  "http://localhost:3000",
].filter(Boolean); 
//the purpose of .filter(Boolean) is to remove any undefined or falsy values from the array. This ensures that only valid origins are included in the allowedOrigins list. for example, if process.env.FRONTEND_URL is not set, it will be undefined and .filter(Boolean) will remove it from the array. This prevents potential issues with CORS configuration by ensuring that only valid origins are considered.

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); //it is a function provided by cors. syntax: callback(error, allow)
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
app.options("/{*splat}", cors(corsOptions));

connectDatabase().catch((err) => {
  console.error("MongoDB connection failed:", err.message);
});

app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(express.json()); //read JSON data from req by the client. now you can access "req.body.name" like requests

app.use(cookieParser()); //cookieParser read cookies sent by the browser. now cookies become accessible through: req.cookies

app.use(bodyParser.urlencoded({ extended: true })); // Converts HTML form/urlencoded data into JavaScript object. Its alternative: app.use(express.urlencoded({ extended: true }));

//import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", conversation);
app.use("/api/v2/message", message);

//This means : Whenever any error occurs anywhere in the application, send it to this middleware
app.use(ErrorHandler);

module.exports = app;

//CORS Configuration
/*
* `corsOptions` is a JavaScript object containing the rules that the `cors` package will use to handle cross-origin requests.

* `origin: (origin, callback) => { ... }`
 * origin: (..) : This is a property that CORS recognizes.It tells the CORS package: Use this function to decide whether an incoming request's origin should be allowed.
  * `origin` is the origin of the incoming request, such as `http://localhost:3000`.
  * `callback` is a function provided by the `cors` package to tell it whether the request should be allowed or rejected.
  * Syntax: `callback(error, allow)`

    * `callback(null, true)` → allow the request.
    * `callback(new Error(...))` → reject the request.
  
  * `allowedOrigins.includes(origin)` checks whether the request's origin exists in our `allowedOrigins` array.
  * `!origin` allows requests that have no `Origin` header. This can happen with some non-browser requests.

* `credentials: true`
In a browser request, credentials generally means information that identifies or authenticates the user, such as: cookies, HTTP authentication information etc
For your project, the important one is cookies.
Your browser is making:

Frontend
http://localhost:3000
       │
       │ request
       ▼
Backend
http://localhost:8000

Suppose the browser has an authentication cookie.

The browser needs permission to include that cookie in a cross-origin request.

That's where credentials come in.
Your backend says: credentials: true
which tells the CORS middleware: This server allows credentialed cross-origin requests.

  * Allows CORS requests to include credentials, especially cookies.
  * Important for this project because authentication uses cookies.
  * It does **not** create or send cookies by itself. It only tells the CORS middleware that credentialed cross-origin requests are allowed.

### Handling CORS Preflight

```js
app.options("/{*splat}", cors(corsOptions));
```

* `app.options()` is an Express method used to handle HTTP `OPTIONS` requests.
* Browsers can send an `OPTIONS` request as a **CORS preflight** before the actual request when the request is not considered a simple/safelisted CORS request.
* `"{*splat}"` is a broad wildcard route pattern in Express 5, so this handler can match OPTIONS requests for different paths. i.e api/v2/user all the routes will be match by this. no need to write separate routes options for each route.
* `cors(corsOptions)` calls the `cors` package with our previously defined CORS rules and returns the middleware that handles the request.

### Why do we need `app.options()` if we already have this?


* CORS preflight is the browser asking permission before sending a potentially non-simple cross-origin request.
* Simple requests, such as a basic GET, can usually go directly to the backend without OPTIONS.
* Requests using methods like PUT, PATCH, DELETE, certain headers like Authorization, or Content-Type: application/json can trigger an OPTIONS preflight.
* app.use(cors(corsOptions)) provides general CORS handling, while app.options(...) explicitly handles these OPTIONS preflight requests.
=============================================================
*/

/*
syntax: app.use(middleware);
means:Register this middleware in the Express request-response cycle.
*/

//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
/*
Code:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

Purpose:
- Makes all files inside the "uploads" folder accessible through /uploads URL.
- Commonly used to serve uploaded images, PDFs, videos, etc.

Example Folder Structure:

backend/
│
├── app.js
├── uploads/
│      ChatGPT.png

Image URL:
http://localhost:8000/uploads/ChatGPT.png

How it works:

1. __dirname
- A built-in Node.js variable.
- It Returns the absolute path of the folder where the current file (app.js) is located.

Example:
__dirname

Output:
C:\Users\Asma\Desktop\Ecommerce\backend

------------------------------------------------

2. path.join()

Purpose:
- Joins multiple path segments into one complete path.
- Automatically uses the correct path separator for the operating system.
- Safer than manually writing file paths.

Example:

path.join(__dirname, "uploads")

Result:
C:\Users\Asma\Desktop\Ecommerce\backend\uploads

------------------------------------------------

3. express.static()

Purpose:
- Tells Express to serve files directly from a folder.

Example:

express.static(path.join(__dirname, "uploads"))

Meaning:
"Look inside the uploads folder whenever a file is requested."

------------------------------------------------

4. app.use("/uploads", ...)

Purpose:
- Creates a URL prefix.

Any request starting with:

/uploads

will be searched inside the uploads folder.

Example:

Browser Request:
http://localhost:8000/uploads/ChatGPT.png

Express searches:

backend/uploads/ChatGPT.png

If the file exists:
✔ Sends the image to the browser.

If the file doesn't exist:
❌ Returns 404 Not Found.

------------------------------------------------

Simple Memory Trick:

__dirname
→ "Where is my current folder?"

path.join()
→ "Build the correct folder path."

express.static()
→ "Serve files from this folder."

"/uploads"
→ "When the URL starts with /uploads, look inside the uploads folder."

Complete Meaning:

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

"If a request URL starts with /uploads, look inside the uploads folder located next to app.js and return the requested file."
*/

//app.use(bodyParser.urlencoded({ extended: true }));
/*

body-parser is middleware that helps Express read data sent by the client in the request body.

For example, a browser might send:

name=Asma&email=asma@gmail.com

The server receives this data, but it needs to parse it into something JavaScript can easily work with.

bodyParser.urlencoded() does that parsing.

5. What does urlencoded mean?

This is important.

URL-encoded form data is one format in which a browser can send form information to the server.

Suppose you have a form:

Name: Asma
Email: asma@gmail.com
Password: 12345

The data can be encoded approximately like:

name=Asma&email=asma%40gmail.com&password=12345

Notice:

name=Asma
&
email=asma%40gmail.com
&
password=12345

& separates different fields.

= separates the field name from its value.

Some characters are encoded. For example:

@ → %40

This format is called:

application/x-www-form-urlencoded

That's where the word urlencoded comes from.

6. Why do we need a parser?

Imagine the browser sends:

name=Asma&email=asma@gmail.com

Express needs to turn it into something like:

{
  name: "Asma",
  email: "asma@gmail.com"
}

Then your controller can easily access:

req.body.name
req.body.email

So:

bodyParser.urlencoded(...)

basically says:

"If the client sends form data in URL-encoded format, parse it and put the resulting values inside req.body."

7. What does { extended: true } mean?

This part:

{ extended: true }

is an options object passed to urlencoded().

It tells the parser to support richer/nested form data structures, rather than only simple key-value pairs.

For example, simple data:

name=Asma&email=asma@gmail.com

becomes:

{
  name: "Asma",
  email: "asma@gmail.com"
}

With extended: true, more complex/nested structures can also be represented.

You don't need to memorize the internal parsing rules right now.

Just remember:

extended: true = allow more complex form data structures.

8. What does the complete line do?
app.use(bodyParser.urlencoded({ extended: true }));

Break it down:

bodyParser
     ↓
body-parser package

.urlencoded()
     ↓
Create middleware that parses URL-encoded form data

{ extended: true }
     ↓
Allow richer/nested form data

app.use()
     ↓
Register this parser as Express middleware

Therefore:

This line tells Express to parse incoming application/x-www-form-urlencoded form data and make the parsed values available through req.body.
*/

//Interview Questions:
/*
Q: What is middleware in Express?
A: Middleware is a function that executes during the request-response cycle. It can modify the request, send a response, or pass control to the next middleware.

Q: Why is the error-handling middleware placed last?
A: Express passes errors from previous middleware and routes to the error handler. If it's placed earlier, it cannot catch errors generated later.

Q: Why use express.json()?
A: It parses JSON request bodies so incoming data is available through req.body.
===========================================
*/