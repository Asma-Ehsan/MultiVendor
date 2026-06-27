const express = require("express");
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(express.json()); //read JSON data from req
app.use(cookieParser()); //read cookies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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

//it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
