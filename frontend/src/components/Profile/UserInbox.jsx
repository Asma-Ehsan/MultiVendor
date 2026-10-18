import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineMessage, AiOutlineSend } from "react-icons/ai";
import { GrGallery } from "react-icons/gr";
import { getImageUrl, server } from "../../server";
import styles from "../../styles/styles";

const ENDPOINT =
process.env.REACT_APP_SOCKET_URL || "https://multivendor-socket.bonto.run";
/*
socketIO: connects to a socket server, and gives back an object which can be used to communicate with server

{ transports: ["websocket"] }

This is a configuration setting that tells Socket.io how to make the connection.

* "websocket" = a real, always-open connection.
* Socket.io can also use polling, where the browser keeps asking the server for new data.
* By default, Socket.io may start with polling and then switch to WebSocket.
* transports: ["websocket"] tells Socket.io to skip polling and use WebSocket directly.

Why an array []?
Because you can allow multiple methods, for example: ["websocket", "polling"]

But ["websocket"] means only WebSocket is allowed.
*/
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInbox = ({active}) => {
  const { user } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]); //the full list of this user's conversations
  const [arivalMessage, setArivalMessage] = useState(null); //a temporary holding spot for a message that JUST arrived via socket
  const [messages, setMessages] = useState([]); //all messages belonging to the CURRENTLY open chat.
  const [currentChat, setCurrentChat] = useState(null); //which conversation is currently open
  const [newMessage, setNewMessage] = useState(""); //whatever text the user is currently typing in the input box.
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null); //info about the OTHER person in the currently open chat (the seller) — their name, avatar, etc.
  const [onlineUsers, setOnelineUsers] = useState([]); //the full online-users list received from the socket server (getUsers event) — used to show green/gray dots.
  const [activeStatus, setActiveStatus] = useState(false); //whether the person in the CURRENTLY open chat specifically is online right now.
  const location = useLocation(); //React Router's hook for reading info about the current page/URL


  //useEffect(..., [])→ installs the listener **once** when the component loads.
  //socketId.on("getMessage", ...) → registers the function to run every time `getMessage` event is received from the socket server.

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arivalMessage &&
      currentChat?.members.includes(arivalMessage.sender) &&
      setMessages((prev) => [...prev, arivalMessage]);
  }, [arivalMessage, currentChat]);

  //get list of conversations that user has
  useEffect(() => {
    // If the user's ID isn't available yet, stop here and don't send the request.
    if (!user?._id) return;
    axios
      .get(`${server}/conversation/get-all-conversation-user/${user._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, 
  //messages in the dependency array means: whenever messages change, re-run this effect and refresh the conversation list so the latest message preview is updated.
  [user, messages]); 

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`,
        );
        setMessages(response?.data?.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  //to get online status of users
  useEffect(() => {
    if (user) {
      const userId = user?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnelineUsers(data);
      });
    }
  }, [user]);

  //to get the sho
  // p info to display its name and avatar
  useEffect(() => {
    const conversationId = location?.state?.conversationId;
    if(!conversationId || !conversations.length) return;

    const chat = conversations.find((item) => item._id === conversationId);
    if(!chat) return;

    setCurrentChat(chat);
    setOpen(true);
    
    const sellerId = chat.members.find((member) => member !== user?._id);
    axios.get(`${server}/shop/get-shop-info/${sellerId}`).then((res) => {
      setUserData(res?.data?.shop);
    }).catch((error) => console.log(error));
  }, [location.state, conversations, user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat?.members?.find((member) => member !== user?._id);
    const online = onlineUsers?.find((user) => user?.userId === chatMembers);

    return online ? true : false;
  };

  //create new message
  const sendMessageHandler = async (e) => {
    // Stops the page from doing a full reload
    e.preventDefault();

    // object is being prepared for the database save
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // receiver is seller here as sender is user
    const receiverId = currentChat.members.find(
      (member) => member !== user._id,
    );

    socketId.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // update last message handler
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: user._id,
    });
    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: user._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

    return (
    <div className="w-full flex flex-col h-[75vh] min-h-[480px] bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      {active && (
        <>
          {!open && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-surface-container flex items-center gap-3 shrink-0">
                <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <AiOutlineMessage size={22} />
                </div>
                <div>
                  <h1 className="text-headline-md font-headline-md text-on-surface tracking-tight">
                    All Messages
                  </h1>
                  <p className="text-body-md font-body-md text-secondary">
                    Chat with sellers about your orders.
                  </p>
                </div>
              </div>

              {/* All message list */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                {conversations &&
                  conversations.map((item, index) => (
                    <MessageList
                      data={item} //conversation's full data
                      key={index}
                      index={index} //row's position in the list
                      setOpen={setOpen} //lets MessageList open the chat when clicked
                      setCurrentChat={setCurrentChat} // lets MessageList set WHICH chat is now open
                      me={user._id} // current logged-in user's own ID
                      userData={userData} //seller's data of currently selected chat
                      setUserData={setUserData} // to update seller's data
                      online={onlineCheck(item)} //call onlineCheck of seller
                      setActiveStatus={setActiveStatus}
                    />
                  ))}

                {conversations && conversations.length === 0 && (
                  <div className="p-10 text-center text-body-md font-body-md text-secondary">
                    You have no messages yet.
                  </div>
                )}
              </div>
            </>
          )}

          {open && (
            <SellerInbox
              setOpen={setOpen}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sendMessageHandler={sendMessageHandler}
              messages={messages}
              sellerId={user._id}
              userData={userData}
              activeStatus={activeStatus}
            />
          )}
        </>
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  userData,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [active, setActive] = useState(0);

  // userData in the parent contains info for only the currently open chat. But MessageList shows multiple users, so each row needs its own user data and ID to display the correct name and avatar. so this user state is for the seller in this specific row of the list, not the currently open chat.
  const [user, setUser] = useState([]); //here user refers to each seller
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    if (!data?.members || !me) return;
    const userId = data.members.find((user) => user !== me);
    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${userId}`);
        setUser(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data]);

    return (
    <div
      className={`w-full flex items-center gap-3 px-4 py-3 border-b border-surface-container/60 cursor-pointer transition-colors duration-200 ${
        active === index
          ? "bg-primary-fixed/50"
          : "bg-transparent hover:bg-surface-container-low"
      }`}
      onClick={(e) =>
        setActive(index) || //highlights this row visually.
        handleClick(data._id) || //navigates (adds the ID to the URL) and sets open to true.
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-fixed"
        />
        {online ? (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-surface-container-lowest"></div>
        ) : (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-outline-variant rounded-full ring-2 ring-surface-container-lowest"></div>
        )}
      </div>

      {/* Name + last message */}
      <div className="min-w-0 flex-1">
        <h1 className="text-body-md font-body-md font-semibold text-on-surface truncate">
          {user?.name}
        </h1>
        <p className="text-body-sm font-body-sm text-secondary truncate">
          {data?.lastMessageId !== userData?._id
            ? "You:"
            : userData?.name?.split("")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  setNewMessage,
  newMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
}) => {
    return (
    <div className="w-full flex flex-col flex-1 min-h-0">
      {/* Message header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={getImageUrl(userData?.avatar)}
            alt=""
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-fixed shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-body-md font-body-md font-semibold text-on-surface truncate">
              {userData?.name}
            </h1>
            <p className="text-label-md font-label-md text-emerald-600">
              {activeStatus ? "Active Now" : null}
            </p>
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
          aria-label="Back to messages"
          onClick={() => setOpen(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low hover:text-primary transition-colors shrink-0"
        >
          <AiOutlineArrowRight size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3 bg-surface-container-low/40">
        {messages &&
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex w-full items-end ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <img
                  src={`${userData?.avatar?.url}`}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-outline-variant mr-2 shrink-0"
                />
              )}
              {item.text !== "" && (
                <div
                  className={`max-w-[75%] flex flex-col ${
                    item.sender === sellerId ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`w-fit max-w-full px-4 py-2 text-body-md font-body-md break-words ${
                      item.sender === sellerId
                        ? "bg-primary text-on-primary rounded-2xl rounded-br-sm"
                        : "bg-surface-container-lowest text-on-surface border border-surface-container rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    <p>{item.text}</p>
                  </div>
                  <p className="text-[11px] text-secondary pt-1">
                    {format(item.createdAt)}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Send Message input */}
      <form
        className="px-4 py-3 border-t border-surface-container flex items-center gap-3 shrink-0"
        onSubmit={sendMessageHandler}
      >
        <GrGallery size={20} className="text-secondary cursor-pointer shrink-0" />
        <input
          type="text"
          required
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
          className="flex-1 h-11 px-4 rounded-full bg-surface-container-low text-on-surface text-body-md font-body-md border border-surface-container-high focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
        />
        <button
          type="submit"
          aria-label="Send"
          className="w-11 h-11 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center shadow-sm transition-all active:scale-95 shrink-0"
        >
          <AiOutlineSend size={20} />
        </button>
      </form>
    </div>
  );
};

export default UserInbox;
