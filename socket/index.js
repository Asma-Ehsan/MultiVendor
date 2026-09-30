const socketIO = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");

require("dotenv").config({
  path: "./.env",
});

const app = express();

// Wraps the Express app in Node's HTTP server because Socket.io needs a raw HTTP server to attach to.

const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://multi-vendor-m5ay-nine.vercel.app",
  "http://localhost:3000",
].filter(Boolean);

//the purpose of .filter(Boolean) is to remove any undefined or falsy values from the array. This ensures that only valid origins are included in the allowedOrigins list. for example, if process.env.FRONTEND_URL is not set, it will be undefined and .filter(Boolean) will remove it from the array. This prevents potential issues with CORS configuration by ensuring that only valid origins are considered.

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

//takes the raw server and attaches the socket.io server to it, now io becomes the main manager for all socket connections.
const io = socketIO(server, {
  cors: corsOptions,
});

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// in this users array, we will have 2 types of users (i.e sender & receiver)
// this [] Tracks everyone currently connected to the socket server
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

//it works is when you leave the chat(closes tab, loses internet, etc) then it"ll remove you from socket
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

// Define a message object with seen property false
const createMessage = ({ senderId, receiverId, text, images }) => ({
  senderId,
  receiverId,
  text,
  images,
  seen: false,
});

// io = the WHOLE server, talking to EVERYONE. 
// socket = ONE specific connected person only.

io.on("connection", (socket) => {
  //io.on("connection", ...) runs whenever a user connects, giving a new socket for that user's connection.
  console.log(`a user is connected`);

//  Frontend emits "addUser".The server receives it, adds the user to the users list((using socket.id, the auto-generated connection ID for this exact browser tab),
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  const messages = {}; // this is a object to track messages sent to each user

  socket.on("sendMessage", ({ senderId, receiverId, text, images }) => {
    const message = createMessage({ senderId, receiverId, text, images });

    // check if the receiver is currently online, and get their live socketId.
    const user = getUser(receiverId);

    //store the messages in the `messages` object
    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    //send the message to the receiver
    // io.to(socketId) targets one specific connection, 
    // then .emit("getMessage", message) sends the message only to that receiver.

    io.to(user?.socketId).emit("getMessage", message);
  });

  socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
    const user = getUser(senderId);

    //update the seen flag for the message
    if (messages[senderId]) {
      const message = messages[senderId].find(
        (message) =>
          message.receiverId === receiverId && message.id === messageId,
      );
      if (message) {
        message.seen = true;

        //send a message seen event to the sender
        io.to(user?.socketId).emit("messageSeen", {
          senderId,
          receiverId,
          messageId,
        });
      }
    }
  });

  //update and get last message
  socket.on("updateLastMessage", ({ lastMessage, lastMessageId }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessageId,
    });
  });

  //when socket will disconnected
  socket.on("disconnect", () => {
    console.log(`User disconnected`);
    // Removes them from the online users list, then broadcasts the updated list to everyone
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log(`server is running on port ${process.env.PORT || 4000}`);
});
