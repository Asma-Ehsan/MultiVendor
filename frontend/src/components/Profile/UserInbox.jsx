import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
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
    <div className="w-[90%] bg-white m-5 !mt-0 shadow-xl h-[85vh] overflow-y-scroll rounded">
        {
            active && (
                <>
                  {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">
            All Messages
          </h1>
          {/* All message list  */}
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
            )
        }
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
      className={`w-full flex p-3 my-[1px] px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"}   cursor-pointer`}
      onClick={(e) =>
        setActive(index) || //highlights this row visually.
        handleClick(data._id) || //navigates (adds the ID to the URL) and sets open to true.
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
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="flex w-full p-3 items-center justify-between mt-2 shadow-sm">
        <div className="flex">
          <img
            src={getImageUrl(userData?.avatar)}
            alt=""
            className="w-[60px] h-[60px] rounded-full border-[#55555563] border-[1px]"
          />
          <div className="pl-3 flex flex-col justify-center">
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

export default UserInbox;
