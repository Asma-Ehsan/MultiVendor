import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
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
    newForm.append("start_Date", startDate.toISOString());
    newForm.append("Finish_Date", endDate.toISOString());
    dispatch(createevent(newForm)); // we are dispatching our createProduct when we have all the data of newForm
  };
  const handleImageChange = (e) => {
    e.preventDefault();

    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleStartDateChange = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    // setEndDate(null) → clears the end date because changing the start date may make the previous end date invalid.
    setEndDate(null);
    // getiing the min property of End Date input field through it's id "end-date" and assign it minEndDate and then converte the date object into string + slice
    document.getElementById("end-date").min = minEndDate.toISOString().slice( 0, 10 );
  };

  const handleEndDateChange = (e) => {
    // Converts the selected value to a Date and saves it in state.
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  // .toISOString() converts that Date object into a text string, and .slice(0, 10) extracts `YYYY-MM-DD`, the format required by <input type="date">

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;

  const inputStyle =
  "mt-2 w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-body-md font-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";
  const labelStyle = "font-label-md text-label-md text-on-surface";
  return (
  <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
    <div className="max-w-3xl mx-auto">
      {/* ---------- Page heading ---------- */}
      <div className="mb-space-md">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
          Marketing
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Create Event
        </h2>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Set up a new event or flash sale for your customers.
        </p>
      </div>

      {/* ---------- Card ---------- */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-space-md sm:p-space-lg">
        {/* create event form */}
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
              placeholder="Enter your event product name..."
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
              placeholder="Enter your event product description..."
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
                placeholder="Enter your event product tags..."
              />
            </div>
          </div>

          {/* Original Price + Discount Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className={labelStyle}>Original Price</label>
              <input
                type="number"
                name="price"
                value={originalPrice}
                className={inputStyle}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter your event product price..."
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
                placeholder="Enter your event product price with discount..."
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
              required
              value={stock}
              className={inputStyle}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter your event product stock..."
            />
          </div>

          {/* Event Start Date + End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <div>
              <label className={labelStyle}>
                Event Start Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="price"
                id="start-date"
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                className={inputStyle}
                onChange={handleStartDateChange}
                min={today}
              />
            </div>

            <div>
              <label className={labelStyle}>
                Event End Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="price"
                id="end-date"
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                className={inputStyle}
                onChange={handleEndDateChange}
                min={minEndDate}
              />
            </div>
          </div>

          {/* Event Images Upload */}
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

export default CreateEvent;
