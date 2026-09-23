import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles.js";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a new user
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* name placeholder */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            {/* Email Placeholder */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password placeholder */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            {/* Upload profile image */}
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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
              </div>
            </div>

            {/* button */}
            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>

            {/* Not having account? */}
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link to="/login" className="text-blue-600 pl-2">
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