const app = require("./app"); //This imports the Express app created inside app.js
const connectDatabase = require("./db/Database");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

//connect DB
connectDatabase();

//create server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandle promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

/*
===========================================
                server.js NOTES
===========================================

Purpose:
- server.js is the entry point of the backend application.
- It starts the Node.js/Express server and connects the application with the database.
- It handles application-level errors and safely shuts down the server when a critical error occurs.


Execution Flow:
1. Import Express app from app.js.
2. Import database connection function from db/Database.js.
3. Load environment variables from config/.env file.
4. Connect to the database.
5. Start the Express server using app.listen().
6. Listen for unexpected errors and handle server shutdown.


1. Import app.js

const app = require("./app");

- Imports the configured Express application.
- app.js contains Express setup, middleware, routes, and error handling.
- Separating app.js and server.js keeps application configuration separate from server startup.


2. Import Database connection

const connectDatabase = require("./db/Database");

- Imports the function responsible for connecting the backend with the database.
- Database.js contains the database connection logic.
- connectDatabase() is called before starting the server.


3. Handling uncaughtException

process.on("uncaughtException", (err) => {})

- Listens for errors that are not handled anywhere in the application.
- Example: using an undefined variable.
- Prevents the application from crashing without logging the error.

What is process?
process is a built-in Node.js object. It gives information and control over the current Node.js application.
What is .on()?
syntax: process.on(event, callback)
means: "When this event happens, execute this function."
Example: process.on("uncaughtException", () => { });
means: "When an uncaught exception occurs, run this code."

err.message:
- Contains the error description.


4. Loading Environment Variables

require("dotenv").config({
    path: "config/.env"
});

- Loads secret values from the config/.env file into process.env.
- Used for values like:
    - PORT
    - DATABASE URL
    - JWT secret keys

Example:
process.env.PORT gives the port number from the .env file.

Why check this the environment i.e production or development?
Because you usually load .env only during development. Production values are usually stored on the hosting platform.


5. Connecting Database

connectDatabase();

- Calls the database connection function.
- Allows controllers and models to communicate with the database.
- Without this line, Your server starts, but database operations fail.

6. Creating Server

const server = app.listen(process.env.PORT, callback);

- Starts the Express server on the port defined in the .env file.

What does listen do?
It tells Node: "Start accepting HTTP requests on this port."

- app.listen() creates an HTTP server and starts accepting client requests.

Example:
PORT=8000

Server runs on:
http://localhost:8000


7. Handling unhandled Promise rejection

process.on("unhandledRejection", (err) => {})

- Handles rejected Promises that do not have a catch block.
- Commonly happens during:
    - Database connection failure
    - API errors
    - Async operations failure


8. server.close()

server.close(() => {
    process.exit(1);
});

- Stops accepting new requests.
- Allows existing requests to complete before shutting down.
- After the server closes, process.exit(1) terminates the Node.js application.


9. process.exit()

Why 1 in process.exit(1)?

Node.js exit codes:

process.exit(0)
- Application stopped successfully.

process.exit(1)
- Application stopped because of an error.


Important Concepts:

process:
- A built-in Node.js object that provides information and control over the current application.

process.env:
- Stores environment variables.

app.listen():
- Starts the Express server.

dotenv:
- Package used to load environment variables from .env files.

Callbacks:
- Functions passed to another function that execute after a task completes.


Interview Questions:

Q: Why do we use separate app.js and server.js?
A:
app.js handles Express configuration, middleware, and routes.
server.js handles database connection and starting the server.

Q: Difference between uncaughtException and unhandledRejection?
A:
uncaughtException handles synchronous errors.
unhandledRejection handles rejected Promises.

Q: Why use server.close() before process.exit()?
A:
It safely closes the server and allows current requests to complete before stopping the application.

===========================================
*/