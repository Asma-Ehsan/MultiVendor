import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import axios from "axios";
import { server } from "../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../styles/styles";
import { GrGallery } from "react-icons/gr";

const ENDPOINT = import.meta.env.VITE_SOCKET_URL;
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const UserInboxPage = () => {
  const { user } = useSelector((state) => state.user);
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
        sender: data.sendId,
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
  }, [user, messages]);

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

  const onlineCheck = (chat) => {
    const chatMembers = chat?.members?.find((member) => member !== user?._id);
    const online = onlineUsers?.find((user) => user?.userId === chatMembers);

    return online ? true : false;
  };

  //create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

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
    <div className="w-full">
      <Header />
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {/* All message list  */}
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={index}
                index={index}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={user._id}
                userData={userData}
                setUserData={setUserData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
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
  const [user, setUser] = useState([]);
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
      className={`w-full flex p-3 my-[1px] px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"}   cursor-pointer`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative">
        <img
          src={`${user?.avatar?.url}`}
          alt=""
          className="w-[50px] h-[50px] rounded-full border-[#55555563] border-[1px]"
        />
        {online ? (
          <div className="absolute top-[2px] right-[2px] w-[12px] h-[12px] bg-green-400 rounded-full"></div>
        ) : (
          <div className="absolute top-[2px] right-[2px] w-[12px] h-[12px] bg-[#c7b9b9] rounded-full"></div>
        )}
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">{user?.name}</h1>
        <p className="text-[16px] text-[#000c]">
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
  seller,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="flex w-full p-3 items-center justify-between">
        <div className="flex">
          <img
            src={`${userData?.avatar?.url}`}
            alt=""
            className="w-[60px] h-[60px] rounded-full border-[#55555563] border-[1px]"
          />
          <div className="pl-3">
            <h1 className=" text-[18px] font-[600]">{userData?.name} </h1>
            <h1>{activeStatus ? "Active Now" : null}</h1>
          </div>
        </div>
        {/* Right Arrow */}
        <AiOutlineArrowRight
          size={20}
          onClick={() => setOpen(false)}
          className="cursor-pointer"
          color="#6e6d6d"
        />
      </div>

      {/* messages */}
      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages &&
          messages.map((item, index) => (
            <div
              className={`flex w-full my-2 ${item.sender === sellerId ? "justify-end" : "justify- start"} `}
            >
              {item.sender !== sellerId && (
                <img
                  src={`${userData?.avatar?.url}`}
                  alt=""
                  className="w-[40px] h-[40px] rounded-full border-[#55555563] border-[1px] mr-3"
                />
              )}
            {
              item.text !== "" && (
                  <div>
                <div className="w-max p-2 rounded bg-slate-200 h-min">
                  {/* message from other side */}
                  <div className="flex w-full">
                    <p> {item.text} </p>
                  </div>
                </div>
                <p className="text-[12px] text-[#000000d3] pt-1">
                  {format(item.createdAt)}
                </p>
              </div>
              )
            }
            </div>
          ))}
      </div>

      {/* Send Message input*/}
      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[3%]">
          <GrGallery size={21} className="cursor-pointer" color="#6e6d6d" />
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            required
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter your message"
            className={`${styles.input} ml-2`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-5 top-5 cursor-pointer"
              color="#6e6d6d"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default UserInboxPage;
