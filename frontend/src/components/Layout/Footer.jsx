import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import { Link } from "react-router-dom";
import logo from "../../Assests/images/logo.png";

const Footer = () => {
  return (
    <footer className="w-full bg-[#0b1c30] text-inverse-on-surface border-t border-surface-container/20 font-jakarta">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        {/* Newsletter */}
        <div className="py-10 border-b border-outline/20 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-headline-md md:text-headline-lg text-surface-container-lowest tracking-tight">
              <span className="text-primary-fixed-dim">Subscribe</span> us for get news{" "}
              events and offers
            </h1>
          </div>
          <div className="lg:col-span-5">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                required
                placeholder="Enter your email..."
                className="flex-1 w-full px-4 py-2.5 text-body-md bg-surface-container/20 text-surface-container-lowest placeholder:text-secondary-fixed-dim/60 rounded-xl border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
              />
              <button className="group px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-label-md font-semibold transition-colors duration-200 shadow-sm flex items-center justify-center gap-1.5 shrink-0">
                <span>Submit</span>
                <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Logo + link columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-outline/20">
          <ul className="lg:col-span-2 space-y-4">
            <li>
              <div className="inline-block bg-white rounded-xl px-3 py-2">
                <img src={logo} alt="ShopNest" className="h-10 w-auto object-contain" />
              </div>
            </li>
            <li>
              <p className="text-body-md text-secondary-fixed-dim max-w-sm leading-relaxed">
                The home and elements needeed to create beatiful products.
              </p>
            </li>
            <li>
              <div className="flex items-center gap-3 pt-1">
                <span className="w-9 h-9 rounded-xl bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <AiFillFacebook size={20} />
                </span>
                <span className="w-9 h-9 rounded-xl bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <AiOutlineTwitter size={20} />
                </span>
                <span className="w-9 h-9 rounded-xl bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <AiFillInstagram size={20} />
                </span>
                <span className="w-9 h-9 rounded-xl bg-surface-container/20 flex items-center justify-center text-inverse-on-surface hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <AiFillYoutube size={20} />
                </span>
              </div>
            </li>
          </ul>

          <ul className="space-y-2.5">
            <h1 className="mb-3 text-[16px] font-bold text-surface-container-lowest tracking-wide">
              Company
            </h1>
            {footerProductLinks.map((link) => (
              <li key={link.name}>
                <Link
                  className="inline-block text-body-md text-secondary-fixed-dim hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2.5">
            <h1 className="mb-3 text-[16px] font-bold text-surface-container-lowest tracking-wide">
              Shop
            </h1>
            {footercompanyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  className="inline-block text-body-md text-secondary-fixed-dim hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2.5">
            <h1 className="mb-3 text-[16px] font-bold text-surface-container-lowest tracking-wide">
              Support
            </h1>
            {footerSupportLinks.map((link) => (
              <li key={link.name}>
                <Link
                  className="inline-block text-body-md text-secondary-fixed-dim hover:text-surface-container-lowest hover:translate-x-1 transition-all duration-200 cursor-pointer"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col lg:flex-row items-center justify-between gap-4 text-body-sm text-secondary-fixed-dim">
          <span>© All rights reserved</span>
          <span>Terms · Privacy Policy</span>
          <div className="flex items-center justify-center">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt=""
              className="w-full max-w-[260px] h-auto"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;