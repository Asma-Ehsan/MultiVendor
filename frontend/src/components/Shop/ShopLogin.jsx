import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import logo from "../../Assests/images/logo.png";

const ShopLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${server}/shop/shop-login`, {
      email,
      password
    }, {withCredentials: true})
    .then((res) => {
      toast.success("Login successfully!");
      navigate("/dashboard");
      window.location.reload(true);
    }).catch((err) => {
      toast.error(err?.response?.data?.message);
    })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface-container-lowest flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-jakarta">
      {/* soft color circles in the background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-32 w-80 h-80 rounded-full bg-tertiary-fixed/40 blur-3xl pointer-events-none"></div>

      {/* Logo + heading */}
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/">
            <img
              src={logo}
              alt="ShopNest"
              className="h-14 w-auto object-contain transition-transform duration-200 hover:scale-105"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
          Login to your shop
        </h2>
        <p className="mt-1 text-center text-body-md text-secondary">
          Manage your products, orders and events.
        </p>
      </div>

      {/* Form card */}
      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-5 sm:px-10 rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)]">
          {/* Form */}
          <form
          onSubmit={handleSubmit}
          className="space-y-5">
            {/* Email Placeholder */}
            <div>
              <label
                htmlFor="email"
                className="block text-label-md text-on-surface-variant"
              >
                Email address
              </label>
              <div className="mt-1.5">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Password placeholder */}
            <div>
              <label
                htmlFor="password"
                className="block text-label-md text-on-surface-variant"
              >
                Password
              </label>
              <div className="mt-1.5 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-4 pr-11 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-secondary hover:text-primary transition-colors"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-secondary hover:text-primary transition-colors"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Remember me*/}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/40 cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-body-md text-on-surface-variant cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              {/* forgot password */}
              <div className="text-body-md">
                <a
                  href="/forgot-password"
                  className="font-semibold text-primary hover:text-primary-container hover:underline transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* button */}
            <div>
              <button
                type="submit"
                className="group w-full h-12 flex justify-center items-center gap-1 px-4 rounded-xl text-label-md text-on-primary bg-primary hover:bg-primary-container shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Submit</span>
                <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Not having account? */}
            <div className="flex items-center justify-center w-full text-body-md text-secondary">
              <h4>Not have any account?</h4>
              <Link
                to="/shop-create"
                className="text-primary font-semibold pl-2 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;