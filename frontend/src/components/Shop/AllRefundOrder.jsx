import { Button } from "@mui/material";
import { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineCheck } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const AllRefundOrder = () => {
  const { seller } = useSelector((state) => state.seller);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const refundOrders = orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success");
  
    const row = [];
  
    refundOrders &&
      refundOrders.forEach((item) => {
        row.push({
          id: item._id,
          itemsQty: item.cart.length,
          total: "US$" + item.totalPrice,
          status: item.status,
        });
      });
  return (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
        {/* ---------- Page heading ---------- */}
        <div className="mb-space-md">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
            Finances
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Refund Requests
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-1">
            Orders your customers asked to refund, and their current status.
          </p>
        </div>

        {/* ---------- Card ---------- */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm overflow-hidden">
          {row.length === 0 ? (
            <div className="p-10 text-center text-body-md font-body-md text-secondary">
              You have no refund requests yet.
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
                            to={`/order/${item.id}`}
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
                Showing <span className="font-bold text-on-surface">{row.length}</span> requests
              </div>
            </>
          )}
        </div>
      </div>
    )}
  </>
);
};

export default AllRefundOrder;