import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const [minAmount, setMinAmout] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [value, setValue] = useState(null);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        setCoupouns(res.data.couponCodes || []);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success("Coupon code deleted succesfully!");
      });
    window.location.reload();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupoun-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Coupon code created successfully!");
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
    { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },
    {
      field: "Delete",
      headerName: "Delete",
      type: "number",
      minWidth: 120,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + "%",
        sold: 10,
      });
    });

  // Put these two constants ABOVE your component (outside AllCoupons)
  const inputStyle =
    "mt-2 w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-body-md font-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";
  const labelStyle = "font-label-md text-label-md text-on-surface";
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
          {/* ---------- Top bar: title + button ---------- */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-md">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                Marketing
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Discount Codes
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="self-start sm:self-auto px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Create Coupon Code
            </button>
          </div>

          {/* ---------- TABLE  ---------- */}
          {/* ---------- Table card ---------- */}
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
            {row.length === 0 ? (
              <div className="p-10 text-center text-body-md font-body-md text-secondary">
                You have no coupon codes yet.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead>
                      <tr className="bg-surface-container-low/70 border-b border-surface-container text-label-sm font-label-sm uppercase tracking-wider text-secondary">
                        <th className="py-3.5 px-6" scope="col">
                          Coupon ID
                        </th>
                        <th className="py-3.5 px-6" scope="col">
                          Name
                        </th>
                        <th className="py-3.5 px-6" scope="col">
                          Discount
                        </th>
                        <th className="py-3.5 px-6 text-center" scope="col">
                          Delete
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-surface-container">
                      {row.map((item) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-surface-container-low/70 transition-colors duration-150"
                        >
                          {/* Coupon ID */}
                          <td className="py-4 px-6">
                            <span className="block max-w-[180px] truncate text-body-sm font-body-sm font-medium tracking-wide text-on-surface">
                              <span className="text-outline">#</span>
                              {item.id}
                            </span>
                          </td>

                          {/* Name */}
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-fixed/60 text-primary font-label-md text-label-md uppercase tracking-wide">
                              {item.name}
                            </span>
                          </td>

                          {/* Discount */}
                          <td className="py-4 px-6 text-body-md font-body-md font-semibold text-on-surface whitespace-nowrap">
                            {item.price}
                          </td>

                          {/* Delete */}
                          <td className="py-4 px-6 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              aria-label="Delete coupon"
                              className="p-2 text-secondary hover:text-error hover:bg-error-container/60 rounded-lg transition-colors inline-flex items-center justify-center"
                            >
                              <AiOutlineDelete
                                size={20}
                                className="transition-transform group-hover:scale-110"
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-surface-container text-label-md font-label-md text-secondary">
                  Showing{" "}
                  <span className="font-bold text-on-surface">
                    {row.length}
                  </span>{" "}
                  coupon codes
                </div>
              </>
            )}
          </div>

          {/* ---------- Popup form ---------- */}
          {open && (
            <div className="fixed inset-0 z-[20000] bg-inverse-surface/50 backdrop-blur-sm flex items-center justify-center p-space-md">
              <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-container-lowest rounded-2xl border border-surface-container shadow-2xl p-6">
                {/* Close button */}
                <div className="flex items-start justify-between gap-space-md">
                  <h5 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                    Create Coupon Code
                  </h5>
                  <RxCross1
                    size={24}
                    className="cursor-pointer text-secondary hover:text-error hover:rotate-90 transition-all duration-200"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <p className="font-body-md text-body-md text-secondary mt-1 mb-space-md">
                  Fill in the details below to give your customers a discount.
                </p>

                {/* create coupoun code */}
                <form onSubmit={handleSubmit} className="space-y-space-md">
                  <div>
                    <label className={labelStyle}>
                      Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      className={inputStyle}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon code name..."
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Discount Percentage <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className={inputStyle}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon code value..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div>
                      <label className={labelStyle}>Min Amount</label>
                      <input
                        type="number"
                        name="value"
                        value={minAmount}
                        className={inputStyle}
                        onChange={(e) => setMinAmout(e.target.value)}
                        placeholder="Min amount..."
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Max Amount</label>
                      <input
                        type="number"
                        name="value"
                        value={maxAmount}
                        className={inputStyle}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Max amount..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyle}>Selected Product</label>
                    <select
                      className={inputStyle}
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <input
                    type="submit"
                    value="Create"
                    className="w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AllCoupons;
