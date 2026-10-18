import { useEffect, useState } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineLock,
  AiOutlineSave,
  AiOutlineCheck,
  AiOutlinePlus
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdOutlineLocationOn, MdTrackChanges } from "react-icons/md";
import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import UserInbox from "./UserInbox";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user && user.phoneNumber ? user.phoneNumber : "",
  );
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserInformation(email, password, phoneNumber, name));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();

    formData.append("image", e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      })
      .then((response) => {
        dispatch(loadUser());
        toast.success("Avatar Updated successfully!");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  if (!user) return null;
  return (
    <div className="w-full min-w-0 flex-1 pb-10">
      {/* Profile */}
      {active === 1 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container p-6 sm:p-10">
          {/* Avatar + name */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8">
            <div className="relative shrink-0">
              <img
                src={user?.avatar?.url}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-primary-fixed shadow-md"
                alt={user?.name}
              />
              <input
                type="file"
                id="image"
                className="hidden"
                onChange={handleImage}
              />
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-container transition-all active:scale-95"
              >
                <AiOutlineCamera size={16} />
              </label>
            </div>

            <h2 className="text-headline-md font-headline-md text-on-surface font-extrabold tracking-tight text-center sm:text-left">
              {user?.name}
            </h2>
          </div>

          {/* Divider */}
          <div className="h-px bg-surface-container mb-8"></div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Full Name <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
                    <AiOutlineUser size={18} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Email Address <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
                    <AiOutlineMail size={18} />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Phone Number <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="phone"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                    value={phoneNumber ?? ""}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
                    <AiOutlinePhone size={18} />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Enter your password <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="w-full h-12 pl-4 pr-11 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
                    <AiOutlineLock size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Update button */}
            <div className="pt-6 mt-8 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
              >
                <AiOutlineSave size={18} />
                <span>Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund  */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* UserInbox */}
      {active === 4 && (
        <div>
          <UserInbox active={active}/>
        </div>
      )}

      {/* Track Order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* ChangePassword */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/* User Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    });
    return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex items-center flex-wrap gap-3">
          <h2 className="text-headline-md font-headline-md text-on-surface tracking-tight">
            Order History
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary">
            {row.length} Orders
          </span>
        </div>
        <p className="text-body-md font-body-md text-secondary mt-1">
          Review your recent purchases, shipment status, and billing totals.
        </p>
      </div>

      {row.length === 0 ? (
        <div className="p-10 text-center text-body-md font-body-md text-secondary">
          You have no orders yet.
        </div>
      ) : (
        <>
          {/* Table (scrolls sideways on small screens) */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70 border-b border-surface-container text-label-sm font-label-sm uppercase tracking-wider text-secondary">
                  <th className="py-3.5 px-6" scope="col">Order ID</th>
                  <th className="py-3.5 px-6" scope="col">Status</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Items Qty</th>
                  <th className="py-3.5 px-6 text-right" scope="col">Total</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-container">
                {row.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-surface-container-low/70 transition-colors duration-150"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-6">
                      <span className="block max-w-[180px] truncate text-body-sm font-body-sm font-medium tracking-wide text-on-surface">
                        <span className="text-outline">#</span>
                        {item.id}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === "Delivered" ||
                      item.status === "Refund Success" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <AiOutlineCheck size={12} />
                          {item.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-700 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* Items Qty */}
                    <td className="py-4 px-6 text-center text-body-md font-body-md font-semibold text-secondary">
                      {item.itemsQty}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 text-right text-body-md font-body-md font-semibold text-on-surface whitespace-nowrap">
                      {item.total}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-center">
                      <Link
                        to={`/user/order/${item.id}`}
                        aria-label="View order"
                        className="p-2 text-secondary hover:text-primary hover:bg-primary-fixed/60 rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <AiOutlineArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-6 py-4 border-t border-surface-container text-label-md font-label-md text-secondary">
            Showing <span className="font-bold text-on-surface">{row.length}</span> orders
          </div>
        </>
      )}
    </div>
  );
};

const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders = orders && orders.filter((item) => item.status === "Processing refund");

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    });

    return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex items-center flex-wrap gap-3">
          <h2 className="text-headline-md font-headline-md text-on-surface tracking-tight">
            Refund Requests
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-tertiary-fixed text-tertiary">
            {row.length} Requests
          </span>
        </div>
        <p className="text-body-md font-body-md text-secondary mt-1">
          Track the orders you asked to refund and see their current status.
        </p>
      </div>

      {row.length === 0 ? (
        <div className="p-10 text-center text-body-md font-body-md text-secondary">
          You have no refund requests yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70 border-b border-surface-container text-label-sm font-label-sm uppercase tracking-wider text-secondary">
                  <th className="py-3.5 px-6" scope="col">Order ID</th>
                  <th className="py-3.5 px-6" scope="col">Status</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Items Qty</th>
                  <th className="py-3.5 px-6 text-right" scope="col">Total</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-container">
                {row.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-surface-container-low/70 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <span className="block max-w-[180px] truncate text-body-sm font-body-sm font-medium tracking-wide text-on-surface">
                        <span className="text-outline">#</span>
                        {item.id}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === "Delivered" ||
                      item.status === "Refund Success" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <AiOutlineCheck size={12} />
                          {item.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-700 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {item.status}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center text-body-md font-body-md font-semibold text-secondary">
                      {item.itemsQty}
                    </td>

                    <td className="py-4 px-6 text-right text-body-md font-body-md font-semibold text-on-surface whitespace-nowrap">
                      {item.total}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <Link
                        to={`/user/order/${item.id}`}
                        aria-label="View order"
                        className="p-2 text-secondary hover:text-primary hover:bg-primary-fixed/60 rounded-lg transition-colors inline-flex items-center justify-center"
                      >
                        <AiOutlineArrowRight
                          size={18}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-surface-container text-label-md font-label-md text-secondary">
            Showing <span className="font-bold text-on-surface">{row.length}</span> requests
          </div>
        </>
      )}
    </div>
  );
};

const TrackOrder = () => {
   const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$" + item.totalPrice,
        status: item.status,
      });
    });

    return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="p-6 border-b border-surface-container">
        <div className="flex items-center flex-wrap gap-3">
          <h2 className="text-headline-md font-headline-md text-on-surface tracking-tight">
            Track Your Orders
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-primary-fixed text-primary">
            {row.length} Orders
          </span>
        </div>
        <p className="text-body-md font-body-md text-secondary mt-1">
          Pick an order to see where your package is right now.
        </p>
      </div>

      {row.length === 0 ? (
        <div className="p-10 text-center text-body-md font-body-md text-secondary">
          You have no orders to track yet.
        </div>
      ) : (
        <>
          {/* Table (scrolls sideways on small screens) */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-surface-container-low/70 border-b border-surface-container text-label-sm font-label-sm uppercase tracking-wider text-secondary">
                  <th className="py-3.5 px-6" scope="col">Order ID</th>
                  <th className="py-3.5 px-6" scope="col">Status</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Items Qty</th>
                  <th className="py-3.5 px-6 text-right" scope="col">Total</th>
                  <th className="py-3.5 px-6 text-center" scope="col">Track</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-surface-container">
                {row.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-surface-container-low/70 transition-colors duration-150"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-6">
                      <span className="block max-w-[180px] truncate text-body-sm font-body-sm font-medium tracking-wide text-on-surface">
                        <span className="text-outline">#</span>
                        {item.id}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {item.status === "Delivered" ||
                      item.status === "Refund Success" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <AiOutlineCheck size={12} />
                          {item.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-label-sm bg-amber-50 text-amber-700 border border-amber-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          {item.status}
                        </span>
                      )}
                    </td>

                    {/* Items Qty */}
                    <td className="py-4 px-6 text-center text-body-md font-body-md font-semibold text-secondary">
                      {item.itemsQty}
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 text-right text-body-md font-body-md font-semibold text-on-surface whitespace-nowrap">
                      {item.total}
                    </td>

                    {/* Track button */}
                    <td className="py-4 px-6 text-center">
                      <Link
                        to={`/user/track/order/${item.id}`}
                        aria-label="Track order"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary-fixed/60 text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md transition-all duration-200"
                      >
                        <MdTrackChanges
                          size={18}
                          className="transition-transform group-hover:scale-110"
                        />
                        <span className="hidden sm:inline">Track</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-6 py-4 border-t border-surface-container text-label-md font-label-md text-secondary">
            Showing <span className="font-bold text-on-surface">{row.length}</span> orders
          </div>
        </>
      )}
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fieldClass = "w-full h-12 pl-4 pr-11 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      .then((response) => {
        toast.success(response.data.message);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

   return (
    <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-6 sm:p-10">
      {/* Title */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
          <AiOutlineLock size={22} />
        </div>
        <div>
          <h2 className="text-headline-md font-headline-md text-on-surface tracking-tight">
            Change Password
          </h2>
          <p className="text-body-md font-body-md text-secondary">
            Choose a new password to keep your account safe.
          </p>
        </div>
      </div>

      <div className="h-px bg-surface-container mb-8"></div>

      <form onSubmit={passwordChangeHandler} className="space-y-6 max-w-xl">
        {/* Old password */}
        <div className="space-y-2">
          <label
            htmlFor="oldPassword"
            className="block text-label-md font-label-md text-on-surface"
          >
            Enter your old password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              id="oldPassword"
              className={fieldClass}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
              <AiOutlineLock size={18} />
            </div>
          </div>
        </div>

        {/* New password */}
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="block text-label-md font-label-md text-on-surface"
          >
            Enter your new password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              id="newPassword"
              className={fieldClass}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
              <AiOutlineLock size={18} />
            </div>
          </div>
        </div>

        {/* Confirm password */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-label-md font-label-md text-on-surface"
          >
            Enter your confirm password <span className="text-error">*</span>
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              className={fieldClass}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-secondary">
              <AiOutlineLock size={18} />
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <AiOutlineSave size={18} />
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fieldClass = "w-full h-12 px-4 rounded-xl bg-surface-container-lowest text-on-surface text-body-md font-body-md border border-outline-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the required fields");
    } else {
      dispatch(
        updateUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        ),
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    dispatch(deleteUserAddress(item._id));
  };
    return (
    <div className="w-full">
      {/* Add new address popup */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container">
            {/* Popup header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-container">
              <h2 className="text-headline-sm font-headline-sm text-on-surface">
                Add new Address
              </h2>
              <button
                type="button"
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-low hover:text-on-surface transition-colors"
                onClick={() => setOpen(false)}
              >
                <RxCross1 size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Country */}
              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Country <span className="text-error">*</span>
                </label>
                <select
                  id="country"
                  className={fieldClass}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Choose your country</option>
                  {Country &&
                    Country.getAllCountries().map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  City <span className="text-error">*</span>
                </label>
                <select
                  id="city"
                  className={fieldClass}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Choose your city</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Address 1 */}
              <div className="space-y-2">
                <label
                  htmlFor="address1"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Address 1 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="address1"
                  className={fieldClass}
                  required
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>

              {/* Address 2 */}
              <div className="space-y-2">
                <label
                  htmlFor="address2"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Address 2 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="address2"
                  className={fieldClass}
                  required
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>

              {/* Zip code */}
              <div className="space-y-2">
                <label
                  htmlFor="zipCode"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Zip Code <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="zipCode"
                  className={fieldClass}
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>

              {/* Address type */}
              <div className="space-y-2">
                <label
                  htmlFor="addressType"
                  className="block text-label-md font-label-md text-on-surface"
                >
                  Address Type <span className="text-error">*</span>
                </label>
                <select
                  id="addressType"
                  className={fieldClass}
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="">Choose your address type</option>
                  {addressTypeData &&
                    addressTypeData.map((item) => (
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
              >
                Add Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Page title + Add new button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Delivery
          </span>
          <h2 className="text-headline-md font-headline-md text-on-surface tracking-tight">
            My Addresses
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface hover:bg-primary transition-all duration-200 font-label-md text-label-md shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <AiOutlinePlus size={16} />
          <span>Add new</span>
        </button>
      </div>

      {/* Saved addresses */}
      <div className="space-y-3">
        {user &&
          user.addresses.map((item, index) => (
            <div
              className="group bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md hover:border-primary-fixed hover:-translate-y-0.5 transition-all duration-300"
              key={index}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                <MdOutlineLocationOn size={22} />
              </div>

              {/* Address Type + Address */}
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary text-label-sm font-label-sm mb-1">
                  {item.addressType}
                </span>
                <p className="text-body-md font-body-md text-on-surface break-words">
                  {item.address1} {item.address2}{" "}
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-1.5 text-body-md font-body-md text-secondary">
                <AiOutlinePhone size={16} />
                <span>{user && user.phoneNumber}</span>
              </div>

              {/* Delete */}
              <button
                type="button"
                aria-label="Delete address"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors self-end sm:self-auto"
                onClick={() => handleDelete(item)}
              >
                <AiOutlineDelete size={20} />
              </button>
            </div>
          ))}

        {user && user.addresses.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container shadow-sm p-10 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center">
              <MdOutlineLocationOn size={28} />
            </div>
            <h5 className="text-headline-sm font-headline-sm text-on-surface">
              You have not saved any address
            </h5>
            <p className="text-body-md font-body-md text-secondary mt-1">
              Click "Add new" to save your first address.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
