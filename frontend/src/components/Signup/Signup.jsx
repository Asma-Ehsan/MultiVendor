import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import logo from "../../Assests/images/logo.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  /*
* JSON: Good for text/data, but can't send raw files.
* FormData: Used when sending **text + files** together.
* It creates a `multipart/form-data` request.
* Multer reads this format and handles the uploaded files.

- "file" is the key that must match upload.single("file").
- multipart/form-data tells the server the request contains files.
- Multer processes the request:
    * Text fields → req.body
    * File → req.file
- The key in .append("file", ...) must match the backend key.
  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const newForm = new FormData();
    newForm.append("file", avatar); //.append(key, value)
    newForm.append("name", name);
    newForm.append("email", email);
    newForm.append("password", password);

    axios
      .post(`${server}/user/create-user`, newForm, config)
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
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
          Register as a new user
        </h2>
        <p className="mt-1 text-center text-body-md text-secondary">
          Create your account to start shopping on ShopNest.
        </p>
      </div>
      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container-lowest py-8 px-5 sm:px-10 rounded-3xl border border-surface-container/80 shadow-[0_12px_36px_-12px_rgba(70,72,212,0.14)]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* name placeholder */}
            <div>
              <label
                htmlFor="email"
                className="block text-label-md text-on-surface-variant"
              >
                Full Name
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  name="text"
                  autoComplete="name"
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
            <div>
              <label
                htmlFor="avatar"
                className="block text-label-md text-on-surface-variant"
              ></label>
              <div className="mt-2 flex items-center">
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
              <h4>Already have an account?</h4>
              <Link
                to="/login"
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

export default Signup;

/*
The problem this solves

When a user picks a file using <input type="file">, JavaScript gives you a File object — this is just raw data sitting in the browser's memory. It is not a normal image URL like https://example.com/photo.jpg that an <img src="..."> tag can directly understand and display.

So, how do you preview the image before it's even uploaded to your server? You need to turn that raw File object into something the <img> tag can read.

What URL.createObjectURL() does
- It's a built-in browser function.
- You give it a File (or Blob) object — in your case, avatar (the selected file, captured earlier by handleFileInputChange).
- It creates a temporary, local, fake URL — something that looks like: blob:http://localhost:3000/1234-5678-abcd
- This special blob: URL points directly to the file sitting in the browser's memory, not to any real server.
- The <img src="..."> tag can understand this blob: URL and displays the image using it.

Real-life example: Imagine you just took a photo on your phone but haven't uploaded it anywhere yet. URL.createObjectURL() is like getting an instant temporary preview thumbnail right there in your phone's gallery — it's not on the internet yet, it's just showing you the raw file that's sitting on your device.

Where does avatar come from?

const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
};

- When the user picks a file in the <input type="file">, e.target.files[0] gives the actual File object.
- It's saved into avatar state using setAvatar(file).

The flow
1. User clicks "Upload a file" and picks an image.
2. handleFileInputChange captures the file and saves it in avatar state.
3. Since avatar is no longer null, React re-renders, and now avatar ? (...) is true.
4. URL.createObjectURL(avatar) creates a temporary local preview URL.
5. The <img> tag shows this preview immediately, without needing internet or your backend at all.
6. Later, when the form is submitted (handleSubmit), the actual file (avatar) is sent to your backend via FormData, uploaded to Cloudinary, and a real, permanent URL is saved in MongoDB.
*/