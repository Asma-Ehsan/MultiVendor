import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import {
  AiOutlineCar,
  AiOutlineSafetyCertificate,
  AiOutlineSync,
} from "react-icons/ai";
import heroImage from "../../../Assests/images/Hero.png" 

const Hero = () => {
  return (
    <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 mt-6 800px:mt-8 font-jakarta">
      <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#ecf2ff] via-[#e5eeff] to-[#dae6fd] border border-white/60 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[480px] lg:min-h-[520px]">
          {/* Left side: text and buttons */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-10 flex flex-col justify-center">
            {/* small badge */}
            <div className="inline-flex items-center gap-1 self-start px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm border border-surface-variant/40 mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-label-sm uppercase tracking-wider text-primary font-bold">
                New Season Arrival
              </span>
              <span className="text-outline-variant">•</span>
              <span className="text-label-sm text-on-surface-variant font-bold">
                Up to 40% Off
              </span>
            </div>

            <h1 className="text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-2 leading-[1.08] capitalize">
              Best Collection for home{" "}
              <span className="text-primary italic font-serif">Decoration</span>
            </h1>

            <p className="text-body-lg text-on-surface-variant max-w-xl mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
              assumenda? Quisquam itaque exercitationem labore vel, dolore
              quidem asperiores, laudantium temporibus soluta optio consequatur
              aliquam deserunt officia. Dolorum saepe nulla provident.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link
                to="/products"
                className="group px-7 py-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface text-label-md hover:bg-primary transition-all duration-300 shadow-[0_6px_20px_-4px_rgba(33,49,69,0.3)] hover:shadow-primary/30 flex items-center gap-1"
              >
                <span>Shop Now</span>
                <IoIosArrowForward
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/best-selling"
                className="px-7 py-3.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-label-md hover:bg-surface-container-lowest transition-all duration-200 border border-surface-container shadow-sm hover:shadow flex items-center gap-1"
              >
                <span>Best Selling</span>
              </Link>
            </div>

            {/* small trust points */}
            <div className="pt-4 border-t border-outline-variant/30 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-sm text-secondary">
              <div className="flex items-center gap-1">
                <AiOutlineCar size={18} className="text-primary" />
                <span>Free Delivery on $50+</span>
              </div>
              <div className="flex items-center gap-1">
                <AiOutlineSafetyCertificate
                  size={18}
                  className="text-primary"
                />
                <span>100% Verified Vendors</span>
              </div>
              <div className="flex items-center gap-1">
                <AiOutlineSync size={18} className="text-primary" />
                <span>30-Day Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right side: image */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[300px] flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none"></div>
            <div className="relative w-full h-full max-h-[460px] rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-surface-container-lowest group">
              <img
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                src={heroImage}
                alt=""
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Hero;