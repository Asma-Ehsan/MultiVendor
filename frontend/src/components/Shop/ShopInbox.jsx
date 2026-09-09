import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import styles from "../../styles/styles";
import { GrGallery } from "react-icons/gr";

const ShopInbox = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
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
              />
            ))}
        </>
      )}

      {open && <SellerInbox setOpen={setOpen} />}
    </div>
  );
};

const MessageList = ({ data, index, setOpen }) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  return (
    <div
      className={`w-full flex p-3 my-[1px] px-3 ${active === index ? "bg-[#00000010]" : "bg-transparent"}   cursor-pointer`}
      onClick={(e) => setActive(index) || handleClick(data._id)}
    >
      <div className="relative">
        <img
          src="http://localhost:8000/uploads/user-1787284710387-582820622.png"
          alt=""
          className="w-[50px] h-[50px] rounded-full border-[#55555563] border-[1px]"
        />
        <div className="absolute top-[2px] right-[2px] w-[12px] h-[12px] bg-green-400 rounded-full"></div>
      </div>
      <div className="pl-3">
        <h1 className=" text-[18px]">Asma Ehsan</h1>
        <p className="text-[16px] text-[#000c]">You: Yeah I am good ....</p>
      </div>
    </div>
  );
};

const SellerInbox = ({ setOpen }) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="flex w-full p-3 items-center justify-between">
        <div className="flex">
          <img
            src="http://localhost:8000/uploads/user-1787284710387-582820622.png"
            alt=""
            className="w-[60px] h-[60px] rounded-full border-[#55555563] border-[1px]"
          />
          <div className="pl-3">
            <h1 className=" text-[18px] font-[600]">Asma Ehsan</h1>
            <h1>Active now</h1>
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
        <div className="flex w-full my-2">
          <img
            src="http://localhost:8000/uploads/user-1787284710387-582820622.png"
            alt=""
            className="w-[40px] h-[40px] rounded-full border-[#55555563] border-[1px] mr-3"
          />
          <div className="w-max p-2 rounded bg-slate-200 h-min">
            <div className="flex w-full">
              <p>hello</p>
            </div>
          </div>
        </div>

        <div className="flex w-full my-2 justify-end">
          <div className="w-max p-2 rounded bg-slate-200 h-min">
            <div className="flex w-full">
              <p>hi </p>
            </div>
          </div>
        </div>
      </div>

      {/* Send Message input*/}
      <form className="p-3 relative w-full flex justify-between items-center">
        <div className="w-[3%]">
          <GrGallery size={21} className="cursor-pointer" color="#6e6d6d" />
        </div>
        <div className="w-[97%]">
          <input
            type="text"
            required
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

export default ShopInbox;
