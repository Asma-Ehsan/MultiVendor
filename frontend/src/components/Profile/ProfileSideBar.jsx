import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {MdOutlineTrackChanges} from "react-icons/md"
import {TbAddressBook} from "react-icons/tb"
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import {server} from "../../server"
import {toast} from "react-toastify"

const ProfileSideBar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    axios.get(`${server}/user/logout`, {withCredentials: true}).then((res) => {
      toast.success(res.data.message);
      window.location.reload(true); //to reload
      navigate("/login");
    }).catch((error) => {
      console.log(error.response.data.message);
    })
  }

    // Gives the right classes for each menu item (active or not)
  const itemClass = (number) =>
    `group flex items-center justify-center 800px:justify-start gap-3 cursor-pointer w-full rounded-lg px-3 800px:px-4 py-3 font-label-md text-label-md transition-colors duration-200 ${
      active === number
        ? "bg-primary-fixed text-primary"
        : "text-secondary hover:text-on-surface hover:bg-surface-container-low"
    }`;

  // Icon color: blue when active, turns blue on hover when not active
  const iconClass = (number) =>
    `shrink-0 transition-colors ${
      active === number ? "text-primary" : "text-secondary group-hover:text-primary"
    }`;

    return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container p-2 800px:p-3.5 space-y-1">
      {/* Profile */}
      <div className={itemClass(1)} onClick={() => setActive(1)}>
        <RxPerson size={20} className={iconClass(1)} />
        <span className="hidden 800px:block">Profile</span>
        {active === 1 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Orders */}
      <div className={itemClass(2)} onClick={() => setActive(2)}>
        <HiOutlineShoppingBag size={20} className={iconClass(2)} />
        <span className="hidden 800px:block">Orders</span>
        {active === 2 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Refunds */}
      <div className={itemClass(3)} onClick={() => setActive(3)}>
        <HiOutlineReceiptRefund size={20} className={iconClass(3)} />
        <span className="hidden 800px:block">Refunds</span>
        {active === 3 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Inbox */}
      <div className={itemClass(4)} onClick={() => setActive(4)}>
        <AiOutlineMessage size={20} className={iconClass(4)} />
        <span className="hidden 800px:block">Inbox</span>
        {active === 4 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Track Orders */}
      <div className={itemClass(5)} onClick={() => setActive(5)}>
        <MdOutlineTrackChanges size={20} className={iconClass(5)} />
        <span className="hidden 800px:block">Track Order</span>
        {active === 5 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Password change */}
      <div className={itemClass(6)} onClick={() => setActive(6)}>
        <RiLockPasswordLine size={20} className={iconClass(6)} />
        <span className="hidden 800px:block">Change Password</span>
        {active === 6 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Address */}
      <div className={itemClass(7)} onClick={() => setActive(7)}>
        <TbAddressBook size={20} className={iconClass(7)} />
        <span className="hidden 800px:block">Address</span>
        {active === 7 && (
          <span className="hidden 800px:block ml-auto w-1.5 h-5 rounded-full bg-primary"></span>
        )}
      </div>

      {/* Divider line */}
      <div className="my-3 h-px bg-surface-container"></div>

      {/* Log out */}
      <div
        className="flex items-center justify-center 800px:justify-start gap-3 cursor-pointer w-full rounded-lg px-3 800px:px-4 py-3 font-label-md text-label-md text-error hover:bg-error-container hover:text-on-error-container transition-colors duration-200"
        onClick={() => setActive(8) || logoutHandler()}
      >
        <AiOutlineLogin size={20} className="shrink-0" />
        <span className="hidden 800px:block">Log out</span>
      </div>
    </div>
  );
};

export default ProfileSideBar;
