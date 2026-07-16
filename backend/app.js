const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json()); //read JSON data from req by the client.
app.use(cookieParser()); //cookieParser read cookies sent by the browser.
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//path is a built-in Node.js module. It helps create file paths that work on Windows, Linux, and macOS.
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.urlencoded({ extended: true })); // Converts HTML form/urlencoded data into JavaScript object. Its alternative: app.use(express.urlencoded({ extended: true }));

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    //Import dotenv package and run config function of dotenv
    path: "config/.env",
  });
}

//import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);

//This means : Whenever any error occurs anywhere in the application, send it to this middleware
app.use(ErrorHandler);

module.exports = app;


/*
===========================================
Serving Static Files (Uploads)
===========================================

Code:
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

Purpose:
- Makes all files inside the "uploads" folder accessible through a URL.
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
===========================================
*/

/*
===========================================
                app.js NOTES
===========================================

Purpose:
- Creates and configures the Express application.
- Registers middleware.
- Registers API routes.
- Registers the global error handler.
- Exports the configured app to server.js.

Execution Flow:
1. Import required packages and middleware.
2. Create the Express application.
3. Register middleware (JSON, cookies, CORS, body parsing, static files).
4. Load environment variables.
5. Register route handlers.
6. Register the global error handler.
7. Export the app.

Key Middleware:
- express.json()
  Parses JSON request bodies and stores them in req.body.

- cookieParser()
  Parses cookies from incoming requests and stores them in req.cookies.

- cors()
  Allows requests from approved frontend origins.
  credentials: true allows cookies and authentication headers.

- bodyParser.urlencoded()
  Parses HTML form (application/x-www-form-urlencoded) data into req.body(JS objects)

- express.static()
  Serves static files such as uploaded images.

Routes:
- /api/v2/user → handled by controller/user.js
- /api/v2/shop → handled by controller/shop.js

Error Handling:
- app.use(ErrorHandler) registers the global error-handling middleware.
- It should always be the last middleware so it can catch errors from routes and other middleware.

Important Concepts:
- Express Application: Created using express().
- Middleware: Functions executed during the request-response cycle.
- Static Files: Files like images, CSS, or PDFs served directly by Express.
- CORS: Allows controlled communication between frontend and backend on different origins.
- Cookie Parser: Makes browser cookies available through req.cookies.


Interview Questions:
Q: What is middleware in Express?
A: Middleware is a function that executes during the request-response cycle. It can modify the request, send a response, or pass control to the next middleware.

Q: Why is the error-handling middleware placed last?
A: Express passes errors from previous middleware and routes to the error handler. If it's placed earlier, it cannot catch errors generated later.

Q: Why use express.json()?
A: It parses JSON request bodies so incoming data is available through req.body.
===========================================
*/