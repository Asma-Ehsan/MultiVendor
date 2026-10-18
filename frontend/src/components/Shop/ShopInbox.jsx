import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import { GrGallery } from "react-icons/gr";
import socketIO from "socket.io-client";
import { format } from "timeago.js";

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

const ENDPOINT =
  process.env.REACT_APP_SOCKET_URL || "https://multivendor-socket.bonto.run";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const ShopInbox = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arivalMessage, setArivalMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnelineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);

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

  useEffect(() => {
    if (!seller?._id) return;
    axios
      .get(`${server}/conversation/get-all-conversation-seller/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, [seller]);

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
    if(seller){
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnelineUsers(data);
      });
    }
  },[seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat?.members?.find((member) => member !== seller?._id);
    const online = onlineUsers?.find((user) => user?.userId === chatMembers);
    
    return online ? true : false;
  }

  //create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id,
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
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

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });
    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
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
  <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
    {/* ---------- Page heading ---------- */}
    <div className="mb-space-md">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
        Communication
      </span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
        Shop Inbox
      </h2>
      <p className="font-body-md text-body-md text-secondary mt-1">
        Chat with your customers about their orders.
      </p>
    </div>

    {/* ---------- Chat card ---------- */}
    <div className="w-full flex flex-col h-[75vh] min-h-[480px] bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      {!open && (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {/* All message list  */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me = {seller._id}
                userData = {userData}
                setUserData = {setUserData}
                online = {onlineCheck(item)}
                setActiveStatus = {setActiveStatus}
              />
            ))}

          {conversations && conversations.length === 0 && (
            <div className="p-10 text-center text-body-md font-body-md text-secondary">
              You have no messages yet.
            </div>
          )}
        </div>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData = {userData}
          activeStatus = {activeStatus}
        />
      )}
    </div>
  </div>
);
};

const MessageList = ({ data, index, setOpen, setCurrentChat, me, setUserData, online, setActiveStatus }) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    if (!data?.members || !me) return;
    const userId = data.members.find((user) => user !== me);
    const getUser = async() => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`)
        setUser(res.data.user);
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  },[me, data]);

  return (
  <div
    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-surface-container/60 cursor-pointer transition-colors duration-200 ${
      active === index
        ? "bg-primary-fixed/50"
        : "bg-transparent hover:bg-surface-container-low"
    }`}
    onClick={(e) =>
      setActive(index) || handleClick(data._id) || setCurrentChat(data) || setUserData(user) || setActiveStatus(online)
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
        {data?.lastMessageId !== user?._id ? "You:" : user?.name?.split("")[0] + ": "} {data?.lastMessage}
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
          src={`${userData?.avatar?.url}`}
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

    {/* Send Message input*/}
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

export default ShopInbox;
