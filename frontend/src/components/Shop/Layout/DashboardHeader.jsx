import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import logo from "../../../Assests/images/logo.png"

// Same style used by all 5 icon links (so we write it only once)
const iconLink =
  "hidden 800px:flex w-11 h-11 items-center justify-center rounded-xl text-on-surface-variant border border-transparent hover:bg-surface-container-low hover:text-primary hover:border-surface-variant/40 hover:-translate-y-0.5 transition-all duration-200";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <header className="w-full h-20 sticky top-0 left-0 z-30 bg-surface-container-lowest/90 backdrop-blur-md border-b border-surface-container shadow-[0_4px_24px_-4px_rgba(11,28,48,0.04)]">
      <div className="h-full px-margin-mobile 800px:px-margin flex items-center justify-between gap-space-lg">

        {/* Shop Logo */}
        <Link to="/dashboard" className="shrink-0">
          <img
            src={logo}
            alt="Shop logo"
            className="h-9 w-auto object-contain transition-transform duration-200 hover:scale-105"
          />
        </Link>

        {/* Shop Navigation */}
        <div className="flex items-center gap-space-xs">
          <Link to="/dashboard-coupouns" className={iconLink} title="Discount Codes">
            <AiOutlineGift size={24} />
          </Link>
          <Link to="/dashboard-events" className={iconLink} title="All Events">
            <MdOutlineLocalOffer size={24} />
          </Link>
          <Link to="/dashboard-products" className={iconLink} title="All Products">
            <FiShoppingBag size={24} />
          </Link>
          <Link to="/dashboard-orders" className={iconLink} title="All Orders">
            <FiPackage size={24} />
          </Link>
          <Link to="/dashboard-messages" className={iconLink} title="All Messages">
            <BiMessageSquareDetail size={24} />
          </Link>

          {/* Small vertical line between icons and avatar */}
          <div className="w-[1px] h-6 bg-outline-variant mx-space-sm hidden 800px:block"></div>

          {/* Seller avatar + name */}
          <Link to={`/shop/${seller._id}`} className="flex items-center gap-space-sm group">
            <img
              src={`${seller.avatar?.url}`}
              alt=""
              className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                {seller.name}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant max-w-[180px] truncate">
                {seller.email}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default DashboardHeader;