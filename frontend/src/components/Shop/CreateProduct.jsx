import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    //the names in " " are those which we declared in models
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    dispatch(createProduct(newForm)); // we are dispatching our createProduct when we have all the data of newForm
  };
  const handleImageChange = (e) => {
    e.preventDefault();

    // When the user picks pictures, this line collects them into a normal list (array) so you can store them in state.
    // e.target.files is the list of files the user picked
    // Array.from(...) turns that list into a array.
    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
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
          Store Hub
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Create Product
        </h2>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Fill in the details below to add a new product to your shop.
        </p>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-space-md sm:p-space-lg">
        {/* create product form */}
        <form onSubmit={handleSubmit} className="space-y-space-md">
          {/* Name */}
          <div>
            <label className={labelStyle}>
              Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className={inputStyle}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your product name..."
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelStyle}>
              Description <span className="text-error">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="6"
              type="text"
              name="description"
              value={description}
              className={`${inputStyle} resize-y`}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your product description..."
            ></textarea>
          </div>

          {/* Category + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className={labelStyle}>
                Category <span className="text-error">*</span>
              </label>
              <select
                className={inputStyle}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Choose a category">Choose a category</option>
                {categoriesData &&
                  categoriesData.map((i) => (
                    <option value={i.title} key={i.title}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={labelStyle}>Tags</label>
              <input
                type="text"
                name="tags"
                value={tags}
                className={inputStyle}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter your product tags..."
              />
            </div>
          </div>

          {/* Original Price + Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className={labelStyle}>
                Original Price <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={originalPrice}
                className={inputStyle}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter your product price..."
              />
            </div>

            <div>
              <label className={labelStyle}>
                Price (With Discount) <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={discountPrice}
                className={inputStyle}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter your product price with discount..."
              />
            </div>
          </div>

          {/* Product Stock */}
          <div>
            <label className={labelStyle}>
              Product Stock <span className="text-error">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={stock}
              className={inputStyle}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your product stock..."
            />
          </div>

          {/* Images */}
          <div>
            <label className={labelStyle}>
              Upload Images <span className="text-error">*</span>
            </label>
            <input
              type="file"
              name=""
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />

            {/* Click this box to open the file picker */}
            <label
              htmlFor="upload"
              className="group mt-2 flex flex-col items-center justify-center gap-1 w-full py-8 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low text-secondary hover:bg-primary-fixed/40 hover:border-primary hover:text-primary cursor-pointer transition-all duration-200"
            >
              <AiOutlinePlusCircle
                size={32}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              <span className="font-label-md text-label-md">Click to upload images</span>
              <span className="font-body-sm text-body-sm">You can choose more than one</span>
            </label>

            {/* Image previews */}
            {images && images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-space-sm mt-space-md">
                {images.map((i) => (
                  <img
                    src={URL.createObjectURL(i)}
                    key={i}
                    alt=""
                    className="w-full aspect-square object-cover rounded-xl border border-surface-container hover:scale-105 transition-transform duration-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <input
            type="submit"
            value="Create"
            className="w-full px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          />
        </form>
      </div>
    </div>
  </div>
);
};

export default CreateProduct;
