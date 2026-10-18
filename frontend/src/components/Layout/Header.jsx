import { useState } from "react";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { getImageUrl } from "../../server";
import logo from "../../Assests/images/logo.png";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { allProducts } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { isSeller } = useSelector((state) => state.seller);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSearchBox, setOpenSearchBox] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filterProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase()),
      );
    setSearchData(filterProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else setActive(false);
  });

  return (
    <>
      <div className="hidden 800px:block h-[137px]">
        <div
          className={`${
            active === true ? "fixed top-0 left-0 z-50 shadow-md" : "relative z-50"
          } w-full transition-shadow duration-300`}
        >
          {/* ===== Top bar: logo, search, seller button, wishlist, cart, profile ===== */}
          <div className="w-full bg-surface-container-lowest border-b border-surface-container font-jakarta">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-6">
              {/* Logo */}
              <div className="shrink-0">
                <Link to="/">
                  <img
                    src={logo}
                    alt="ShopNest"
                    className="h-12 w-auto object-contain transition-transform duration-200 hover:scale-105"
                  />
                </Link>
              </div>

              {/* search box */}
              <div className="flex-1 max-w-xl relative">
                <input
                  type="text"
                  placeholder="Search for products, brands and categories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-5 pr-14 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-full border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
                <div
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary hover:bg-primary-container text-on-primary flex items-center justify-center cursor-pointer shadow-sm transition-colors duration-200"
                  onClick={() => setOpenSearchBox(true)}
                >
                  <AiOutlineSearch size={18} />
                </div>
                {searchData && searchData.length !== 0 ? (
                  <>
                    {/* inset-0 = top:0, left:0, right:0, bottom:0) */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => {
                        setOpenSearchBox(false);
                        setSearchData(null);
                        setSearchTerm("");
                      }}
                    />
                    <div className="absolute top-full left-0 mt-2 w-full max-h-[60vh] overflow-y-auto bg-surface-container-lowest shadow-xl rounded-2xl border border-surface-container z-40 p-2">
                      {searchData &&
                        searchData.map((i, index) => {
                          return (
                            <Link
                              to={`/product/${i._id}`}
                              key={index}
                              onClick={() => {
                                setSearchData(null);
                                setSearchTerm("");
                              }}
                            >
                              <div className="w-full flex items-center py-2 px-2 hover:bg-surface-container-low rounded-xl transition-colors duration-200 group">
                                <img
                                  src={getImageUrl(i.images && i.images[0])}
                                  alt=""
                                  className="w-[40px] h-[40px] mr-[10px] object-cover rounded-lg border border-surface-container"
                                />
                                <h5 className="line-clamp-2 text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                                  {i.name}
                                </h5>
                              </div>
                            </Link>
                          );
                        })}
                    </div>
                  </>
                ) : null}
              </div>

              {/* Right side: seller button, wishlist, cart, profile */}
              <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                {/* Seller/Dashboard Button */}
                <Link
                  to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                  className="group flex items-center gap-1 px-4 py-2.5 bg-surface-container text-on-secondary-fixed rounded-xl text-label-md border border-surface-variant/40 hover:bg-primary-fixed hover:text-primary transition-all duration-200"
                >
                  <span>{isSeller ? "Dashboard" : "Become a Seller"}</span>
                  <IoIosArrowForward className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                {/* Heart Icon */}
                <div
                  className="relative cursor-pointer p-2.5 rounded-xl text-on-surface hover:bg-surface-container-low hover:text-primary border border-transparent hover:border-surface-variant/40 transition-all duration-200"
                  onClick={() => setOpenWishlist(true)}
                >
                  <AiOutlineHeart size={24} />
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-tertiary text-on-tertiary text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-surface-container-lowest">
                    {wishlist && wishlist.length}
                  </span>
                </div>

                {/* Cart Icon */}
                <div
                  className="flex items-center gap-1 cursor-pointer px-3 py-1.5 rounded-xl text-on-surface hover:bg-surface-container-low border border-transparent hover:border-surface-variant/40 transition-all duration-200"
                  onClick={() => setOpenCart(true)}
                >
                  <div className="relative p-1">
                    <AiOutlineShoppingCart size={24} />
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-surface-container-lowest">
                      {cart && cart.length}
                    </span>
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-label-sm text-secondary leading-none">
                      Cart
                    </span>
                    <span className="text-label-md font-bold leading-tight">
                      {cart && cart.length} items
                    </span>
                  </div>
                </div>

                {/* divider line */}
                <div className="w-[1px] h-6 bg-outline-variant hidden lg:block"></div>

                {/* Profile */}
                {isAuthenticated ? (
                  <Link to={"/profile"} className="group flex items-center gap-2">
                    <img
                      src={user?.avatar?.url}
                      className="w-9 h-9 rounded-xl object-cover border-2 border-surface-container-high group-hover:border-primary group-hover:shadow transition-all duration-200"
                      alt=""
                    />
                    <div className="hidden 2xl:flex flex-col">
                      <span className="text-label-sm text-secondary leading-none">
                        Hello, {user?.name}
                      </span>
                      <span className="text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                        Account
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link to={"/login"} className="group flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shrink-0 text-on-primary shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                      <CgProfile size={20} />
                    </div>
                    <div className="hidden 2xl:flex flex-col">
                      <span className="text-label-sm text-secondary leading-none">
                        Hello, Sign in
                      </span>
                      <span className="text-label-md text-on-surface font-semibold group-hover:text-primary transition-colors">
                        Account
                      </span>
                    </div>
                  </Link>
                )}

                {/* cart popup */}
                {openCart ? (
                  <>
                    <Cart setOpenCart={setOpenCart} />
                  </>
                ) : null}

                {/* wishlist popup */}
                {openWishList ? (
                  <>
                    <Wishlist setOpenWishlist={setOpenWishlist} />
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* ===== Nav bar: categories + nav links ===== */}
          <div className="w-full flex items-center bg-surface-container-low border-b border-surface-container h-14 font-jakarta">
            <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 relative flex items-center justify-start gap-6">
              {/* categories */}
              <div onClick={() => setDropDown(!dropDown)}>
                <div className="relative h-10 w-[230px] hidden 1000px:block">
                  <BiMenuAltLeft
                    size={22}
                    className="absolute top-1/2 -translate-y-1/2 left-3 text-white pointer-events-none"
                  />
                  <button
                    className={`h-[100%] w-full flex justify-between items-center pl-10 pr-9 bg-primary text-on-primary text-label-md rounded-lg select-none shadow-sm hover:bg-primary-container hover:shadow transition-all duration-200`}
                  >
                    All Categories
                  </button>
                  <IoIosArrowDown
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                    onClick={() => setDropDown(!dropDown)}
                  />
                  {dropDown ? (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => {
                          setDropDown(false);
                        }}
                      />
                      <DropDown
                        categoriesData={categoriesData}
                        setDropDown={setDropDown}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              {/* navitems */}
              <div className="flex items-center">
                <Navbar active={activeHeading} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile header */}
      <div
        className={`${
          active === true ? "fixed" : "relative"
        } w-full h-[60px] bg-surface-container-lowest border-b border-surface-container z-50 top-0 left-0 shadow-sm 800px:hidden font-jakarta`}
      >
        <div className="w-full h-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={36}
              className="ml-4 cursor-pointer text-on-surface hover:text-primary active:scale-95 transition-all duration-200"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img
                src={logo}
                alt="ShopNest"
                className="h-10 w-auto object-contain cursor-pointer"
              />
            </Link>
          </div>
          <div>
            <div
              className="relative cursor-pointer mr-[20px] p-1.5 rounded-xl text-on-surface hover:text-primary active:scale-95 transition-all duration-200"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={28} />
              <span className="absolute -right-0.5 -top-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-surface-container-lowest">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>
        {/* cart popup */}
        {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

        {/* header sidebar */}
        {open && (
          <div className="fixed w-full bg-black/40 backdrop-blur-sm z-50 h-full top-0 left-0">
            <div className="fixed w-[75%] max-w-[320px] bg-surface-container-lowest h-screen top-0 left-0 z-10 overflow-y-scroll shadow-2xl">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div className="relative mr-[15px] rounded-xl text-on-surface hover:text-primary active:scale-95 transition-all duration-200 cursor-pointer"
                  onClick={() => setOpenWishlist(true)}
                  >
                    <AiOutlineHeart size={28} className="mt-5 ml-3" 
                    />
                    <span className="absolute right-0 top-3 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold leading-none flex items-center justify-center ring-2 ring-surface-container-lowest">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={26}
                  className="ml-4 mt-5 cursor-pointer text-on-surface hover:text-error hover:rotate-90 transition-all duration-200"
                  onClick={() => setOpen(false)}
                />
              </div>
              {/* wishlist popup */}
                {openWishList ? (
                  <>
                    <Wishlist setOpenWishlist={setOpenWishlist} />
                  </>
                ) : null}
              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-[42px] w-full px-4 text-body-md bg-surface-container-low text-on-surface placeholder:text-secondary rounded-full border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchData && searchData.length !== 0 ? (
                  <div className="absolute bg-surface-container-lowest z-10 shadow-xl w-full left-0 mt-2 p-3 rounded-2xl border border-surface-container">
                    {searchData &&
                      searchData.map((i, index) => {
                        return (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={() => {
                                setOpenSearchBox(false);
                                setSearchData(null);
                                setSearchTerm("");
                              }}
                            />
                            <Link
                              to={`/product/${i._id}`}
                              key={index}
                              onClick={() => {
                                setSearchData(null);
                                setSearchTerm("");
                              }}
                            >
                              <div className="w-full flex items-center py-2 px-1 hover:bg-surface-container-low rounded-xl transition-colors duration-200">
                                <img
                                  src={getImageUrl(i.images && i.images[0])}
                                  alt=""
                                  className="w-[40px] h-[40px] mr-[10px] object-cover rounded-lg border border-surface-container"
                                />
                                <h5 className="line-clamp-2 text-body-md font-semibold text-on-surface">
                                  {i.name}
                                </h5>
                              </div>
                            </Link>
                          </>
                        );
                      })}
                  </div>
                ) : null}
              </div>

              {/* Nav Items */}
              <Navbar active={activeHeading} />

              {/* Seller Button */}
              <div className="mx-4 mt-2">
                <Link
                  to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                  className="group flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface text-label-md shadow-md hover:bg-primary transition-all duration-300"
                >
                  <span>{isSeller ? "Dashboard" : "Become a Seller"}</span>
                  <IoIosArrowForward className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

              <br />
              <br />
              <br />

              <div className="flex w-full justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-[16px] font-semibold pr-[10px] text-on-surface-variant hover:text-primary transition-colors duration-200"
                    >
                      {" "}
                      Login /
                    </Link>
                    <Link
                      to="/Signup"
                      className="text-[16px] font-semibold text-on-surface-variant hover:text-primary transition-colors duration-200"
                    >
                      {" "}
                      Signup
                    </Link>
                  </>
                ) : (
                  <Link to="/profile" className="pb-[15px]">
                    <img
                      src={user?.avatar?.url}
                      className="w-[60px] h-[60px] rounded-2xl object-cover border-2 border-surface-container-high hover:border-primary transition-colors duration-200"
                      alt=""
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;