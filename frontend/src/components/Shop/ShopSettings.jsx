import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState((seller && seller.name) || "");
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : "",
  );
  const [address, setAddress] = useState((seller && seller.address) || "");
  const [phoneNumber, setPhoneNumber] = useState((seller && seller.phoneNumber) || null);
  const [zipCode, setZipcode] = useState((seller && seller.zipCode) || null);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    await axios.put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    }).then((res) => {
        dispatch(loadSeller());
        toast.success("Avatar Updated Successfully!");
    }).catch((error) => {
        toast.error(error.response.data.message);
    })
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    await axios.put(`${server}/shop/update-seller-info`, 
       { name, 
        description, 
        address, 
        phoneNumber, 
        zipCode},
        {withCredentials: true}
    ).then((res) => {
        toast.success("Shop info updated Successfully!");
        dispatch(loadSeller());
    }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong");
    })
  };

  const inputStyle =
  "mt-2 w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-body-md font-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";
  const labelStyle = "font-label-md text-label-md text-on-surface";

  return (
  <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
    <div className="max-w-3xl mx-auto">
      {/* ---------- Page heading ---------- */}
      <div className="mb-space-md">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
          Store Management
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Shop Settings
        </h2>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Update your shop picture and contact details.
        </p>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-space-md sm:p-space-lg">
        {/* Profile Image */}
        <div className="flex justify-center mb-space-lg">
          <div className="relative">
            <img
              src={avatar ? avatar : `${seller.avatar?.url}`}
              alt=""
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-primary-fixed"
            />
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label
              htmlFor="image"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-container hover:scale-110 transition-all duration-200"
            >
              <AiOutlineCamera size={18} />
            </label>
          </div>
        </div>

        {/* shop info */}
        <form className="space-y-space-md" onSubmit={updateHandler}>
          {/* Name */}
          <div>
            <label className={labelStyle}>Shop Name</label>
            <input
              type="name"
              placeholder={`${seller.name}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          {/* Shop Description */}
          <div>
            <label className={labelStyle}>Shop description</label>
            <input
              type="name"
              placeholder={`${
                seller?.description
                  ? seller.description
                  : "Enter your shop description"
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
            />
          </div>

          {/* Shop Address */}
          <div>
            <label className={labelStyle}>Shop Address</label>
            <input
              type="name"
              placeholder={seller?.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          {/* Phone + Zip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className={labelStyle}>Shop Phone Number</label>
              <input
                type="number"
                placeholder={seller?.phoneNumber}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Shop Zip Code</label>
              <input
                type="number"
                placeholder={seller?.zipCode}
                value={zipCode}
                onChange={(e) => setZipcode(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <input
            type="submit"
            value="Update Shop"
            className="w-full px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          />
        </form>
      </div>
    </div>
  </div>
);
};

export default ShopSettings;
