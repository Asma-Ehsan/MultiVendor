const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((data) => {
      console.log(`mongod connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;

/*
===========================================
             Database.js NOTES
===========================================

Purpose:
- Connects the backend application to the MongoDB database using Mongoose.
- This function is called from server.js before starting the server.
- Without a successful database connection, the application cannot perform database operations.

Execution Flow:

server.js
      │
      ▼
connectDatabase()
      │
      ▼
mongoose.connect(process.env.DB_URL)
      │
      ▼
Reads DB_URL from .env
      │
      ▼
Connects to MongoDB Atlas
      │
      ▼
Connection Successful
      │
      ▼
Prints MongoDB Host Name


-------------------------------------------
Code Explanation
-------------------------------------------

1. Import Mongoose

const mongoose = require("mongoose");

- Imports the Mongoose library.
- Mongoose is an ODM (Object Data Modeling) library used to interact with MongoDB.


-------------------------------------------

2. Create Database Connection Function

const connectDatabase = () => {}

- Creates a function responsible for connecting the backend with MongoDB.
- The function executes only when it is called in server.js.


-------------------------------------------

3. Connect to MongoDB

mongoose.connect(process.env.DB_URL)

- Reads the MongoDB connection string from the .env file.
- Attempts to establish a connection with the MongoDB database.
- This operation is asynchronous.


-------------------------------------------

4. Why can we use .then()?

mongoose.connect(process.env.DB_URL)
    .then(...)

- mongoose.connect() returns a Promise.
- Since it returns a Promise, we can use:
    • .then()
    • .catch()
    • await

How do we know it returns a Promise?

1. The official Mongoose documentation states that connect() returns a Promise.
2. It supports .then() and .catch().
3. It can also be used with await.

Example:

await mongoose.connect(process.env.DB_URL);

Only Promises (or thenables) can be awaited.


-------------------------------------------

5. Where does "data" come from?

.then((data) => {

})

- The variable "data" is NOT created by us.
- Mongoose automatically passes the resolved value of the Promise to the callback function.

Internally (simplified), Mongoose behaves like:

connect(DB_URL)
    ↓
Connection Successful
    ↓
Promise.resolve(connectionObject)

The resolved connection object is automatically received by:

.then((data) => {

})

The name "data" is just a parameter name.

These are all equivalent:

.then((data) => {})
.then((connection) => {})
.then((result) => {})
.then((abc) => {})

The variable name is your choice.


-------------------------------------------

6. data.connection.host

console.log(data.connection.host);

- "data" contains information about the database connection.
- connection is one of its properties.
- host returns the MongoDB server hostname.

Example Output:

cluster0.bgyrwtr.mongodb.net

This confirms that the backend successfully connected to MongoDB.


-------------------------------------------

7. Export Function

module.exports = connectDatabase;

- Exports the connectDatabase() function.
- Allows server.js to import and call it.


===========================================
Important Concepts
===========================================

Mongoose
- Library used to communicate with MongoDB.

ODM (Object Data Modeling)
- Maps JavaScript objects to MongoDB documents.

Promise
- Represents an asynchronous operation that will complete in the future.

.then()
- Executes when the Promise is fulfilled (successful).

.catch()
- Executes when the Promise is rejected (error).

Asynchronous Operation
- The program doesn't wait for the database connection to finish before continuing.
- The Promise notifies us when the connection succeeds or fails.

process.env.DB_URL
- Reads the database connection string from the .env file.


===========================================
File Connections
===========================================

config/.env
      │
      ▼
Database.js
      │
      ▼
mongoose.connect()
      │
      ▼
MongoDB Atlas

server.js
      │
      ▼
connectDatabase();


===========================================
Interview Questions
===========================================

Q: Why do we use Mongoose?
A:
It provides schemas, models, validation, and an easier way to interact with MongoDB.

Q: Why is the database connected before starting the server?
A:
So the application can access the database immediately. Without a database connection, database operations would fail.

Q: How do we know mongoose.connect() returns a Promise?
A:
The Mongoose documentation specifies that connect() returns a Promise. We can also tell because it supports .then(), .catch(), and await.

Q: Where does the "data" parameter in .then((data) => {}) come from?
A:
It is automatically passed by Mongoose when the Promise is resolved. It contains information about the successful database connection.

Q: Can we rename "data"?
A:
Yes. It is just a function parameter. Any valid variable name can be used.

===========================================
*/