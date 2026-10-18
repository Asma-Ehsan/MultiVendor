import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import logo from "../../Assests/images/logo.png";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const newForm = new FormData();
    newForm.append("file", avatar);
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);
    newForm.append("zipCode", zipCode);
    newForm.append("address", address);
    newForm.append("phoneNumber", phoneNumber);

    axios
      .post(`${server}/shop/create-shop`, newForm, config)
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        setZipCode(null);
        setAddress("");
        setPhoneNumber(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

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
          Register as a seller
        </h2>
        <p className="mt-1 text-center text-body-md text-secondary">
          Open your shop on ShopNest and start selling.
        </p>
      </div>

      {/* Form card */}
      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
        <div className="bg-surface-container-lowest py-8 px-5 sm:px-10 rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* name placeholder */}
            <div>
              <label
                htmlFor="email"
                className="block text-label-md text-on-surface-variant"
              >
                Shop Name
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

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

            {/* PhoneNumber Placeholder */}
            <div>
              <label
                htmlFor="number"
                className="block text-label-md text-on-surface-variant"
              >
                Phone Number
              </label>
              <div className="mt-1.5">
                <input
                  type="number"
                  name="phone-number"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Address Placeholder */}
            <div>
              <label
                htmlFor="address"
                className="block text-label-md text-on-surface-variant"
              >
                Address
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  name="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full px-4 py-2.5 text-body-md bg-surface-container-low hover:bg-surface-container focus:bg-surface-container-lowest text-on-surface placeholder:text-secondary rounded-xl border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* Zipcode Placeholder */}
            <div>
              <label
                htmlFor="number"
                className="block text-label-md text-on-surface-variant"
              >
                Zip Code
              </label>
              <div className="mt-1.5">
                <input
                  type="number"
                  name="zipcode"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
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

            {/* Upload profile image */}
            <div className="sm:col-span-2">
              <label
                htmlFor="avatar"
                className="block text-label-md text-on-surface-variant"
              ></label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary-fixed bg-surface-container-low shrink-0">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-12 w-12 text-outline" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-4 flex items-center justify-center px-4 py-2 rounded-xl border border-surface-variant/60 bg-surface-container text-label-md text-on-surface cursor-pointer hover:bg-primary-fixed hover:text-primary transition-all duration-200"
                >
                  <span>Upload a file</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
                <span className="ml-3 text-body-sm text-secondary">
                  JPG or PNG
                </span>
              </div>
            </div>

            {/* button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="group w-full h-12 flex justify-center items-center gap-1 px-4 rounded-xl text-label-md text-on-primary bg-primary hover:bg-primary-container shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Submit</span>
                <IoIosArrowForward className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Already have an account? */}
            <div className="sm:col-span-2 flex items-center justify-center w-full text-body-md text-secondary">
              <h4>Already have an account?</h4>
              <Link
                to="/shop-login"
                className="text-primary font-semibold pl-2 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopCreate;