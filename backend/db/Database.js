const mongoose = require("mongoose");

const connectDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  if (!process.env.DB_URL) {
    throw new Error("DB_URL is not defined");
  }

  const data = await mongoose.connect(process.env.DB_URL);
  console.log(`mongod connected with server: ${data.connection.host}`);
  return data;
};

module.exports = connectDatabase;


/*
===========================================
             Database.js NOTES
===========================================

Purpose:
- Connects the backend application to MongoDB using Mongoose.
- Checks whether a MongoDB connection already exists before creating a new one.
- Reads the MongoDB connection string from the .env file.
- Returns the existing or newly created database connection.

Execution Flow:

app.js
      │
      ▼
connectDatabase()
      │
      ▼
Is MongoDB already connected?
      │
   ┌──┴──┐
  YES    NO
   │      │
   ▼      ▼
Return   Check DB_URL
existing    │
connection  ▼
          mongoose.connect()
              │
              ▼
          MongoDB


-------------------------------------------
Code Explanation
-------------------------------------------

2. Create Database Connection Function

const connectDatabase = async () => {

- The function runs only when `connectDatabase()` is called.

-------------------------------------------

3. Check Existing Connection

if (mongoose.connection.readyState >= 1)
    return mongoose.connection;

- `mongoose.connection` represents Mongoose's current MongoDB connection.
- `readyState` tells the current state of that connection.

Important readyState values:
    0 → disconnected
    1 → connected
    2 → connecting
    3 → disconnecting

- `>= 1` checks whether the connection is already in an active/non-disconnected state.
- If the condition is true, the function immediately returns the existing connection.
- This prevents repeatedly calling `mongoose.connect()` when a connection already exists.

Simple idea:

Already connected → return existing connection
Not connected → continue and create a connection


-------------------------------------------

6. Display Connected MongoDB Host

console.log(`mongod connected with server: ${data.connection.host}`);

- `data` contains information about the successful MongoDB connection.
- `data.connection` gives access to the connection object.
- `data.connection.host` gives the hostname of the MongoDB server.
- The value is printed in the terminal to confirm that the connection succeeded.

Example:

mongod connected with server: cluster0.mongodb.net


-------------------------------------------

7. Return the Connection

return data;

- Returns the result of the successful MongoDB connection.
- This allows the code that called `connectDatabase()` to receive the connection information.
*/
