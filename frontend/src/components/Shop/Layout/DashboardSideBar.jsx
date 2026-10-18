import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

// Style used by every menu item
const itemBase =
  "group flex items-center justify-center 800px:justify-start gap-space-sm px-space-sm py-2.5 rounded-xl transition-all duration-200";
const itemActive = "bg-primary-container text-on-primary-container";
const itemIdle =
  "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface";

// Style for icons and text
const iconStyle =
  "shrink-0 transition-transform duration-200 group-hover:scale-110";
const textStyle = "hidden 800px:block font-body-md text-body-md";

// Style for group titles
const groupTitle =
  "hidden 800px:block px-space-sm pt-space-md pb-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider";
const groupLine = "800px:hidden border-surface-container my-space-sm";

const DashboardSideBar = ({ active }) => {
  return (
    <aside className="w-full sticky top-20 left-0 z-10 h-[calc(100vh-5rem)] overflow-y-auto bg-surface-container-lowest border-r border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-space-sm py-space-md">
      <nav className="space-y-space-xs">

        {/* ---------- Store Hub ---------- */}
        <p className={groupTitle}>Store Hub</p>

        <Link
          to="/dashboard"
          title="Dashboard"
          className={`${itemBase} ${active === 1 ? itemActive : itemIdle}`}
        >
          <RxDashboard size={22} className={iconStyle} />
          <span className={textStyle}>Dashboard</span>
        </Link>

        <Link
          to="/dashboard-orders"
          title="All Orders"
          className={`${itemBase} ${active === 2 ? itemActive : itemIdle}`}
        >
          <FiShoppingBag size={22} className={iconStyle} />
          <span className={textStyle}>All Orders</span>
        </Link>

        <Link
          to="/dashboard-products"
          title="All Products"
          className={`${itemBase} ${active === 3 ? itemActive : itemIdle}`}
        >
          <FiPackage size={22} className={iconStyle} />
          <span className={textStyle}>All Products</span>
        </Link>

        <Link
          to="/dashboard-create-product"
          title="Create Product"
          className={`${itemBase} ${active === 4 ? itemActive : itemIdle}`}
        >
          <AiOutlineFolderAdd size={22} className={iconStyle} />
          <span className={textStyle}>Create Product</span>
        </Link>

        {/* ---------- Marketing & Events ---------- */}
        <hr className={groupLine} />
        <p className={groupTitle}>Marketing &amp; Events</p>

        <Link
          to="/dashboard-events"
          title="All Events"
          className={`${itemBase} ${active === 5 ? itemActive : itemIdle}`}
        >
          <MdOutlineLocalOffer size={22} className={iconStyle} />
          <span className={textStyle}>All Events</span>
        </Link>

        <Link
          to="/dashboard-create-event"
          title="Create Event"
          className={`${itemBase} ${active === 6 ? itemActive : itemIdle}`}
        >
          <VscNewFile size={22} className={iconStyle} />
          <span className={textStyle}>Create Event</span>
        </Link>

        <Link
          to="/dashboard-coupouns"
          title="Discount Codes"
          className={`${itemBase} ${active === 9 ? itemActive : itemIdle}`}
        >
          <AiOutlineGift size={22} className={iconStyle} />
          <span className={textStyle}>Discount Codes</span>
        </Link>

        {/* ---------- Finances & Communication ---------- */}
        <hr className={groupLine} />
        <p className={groupTitle}>Finances &amp; Communication</p>

        <Link
          to="/dashboard-withdraw-money"
          title="Withdraw Money"
          className={`${itemBase} ${active === 7 ? itemActive : itemIdle}`}
        >
          <CiMoneyBill size={22} className={iconStyle} />
          <span className={textStyle}>Withdraw Money</span>
        </Link>

        <Link
          to="/dashboard-refunds"
          title="Refunds"
          className={`${itemBase} ${active === 10 ? itemActive : itemIdle}`}
        >
          <HiOutlineReceiptRefund size={22} className={iconStyle} />
          <span className={textStyle}>Refunds</span>
        </Link>

        <Link
          to="/dashboard-messages"
          title="All Messages"
          className={`${itemBase} ${active === 8 ? itemActive : itemIdle}`}
        >
          <BiMessageSquareDetail size={22} className={iconStyle} />
          <span className={textStyle}>Shop Inbox</span>
        </Link>

        {/* ---------- Store Management ---------- */}
        <hr className={groupLine} />
        <p className={groupTitle}>Store Management</p>

        <Link
          to="/settings"
          title="Settings"
          className={`${itemBase} ${active === 11 ? itemActive : itemIdle}`}
        >
          <CiSettings size={22} className={iconStyle} />
          <span className={textStyle}>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};
export default DashboardSideBar;