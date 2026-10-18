import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { MdOutlineAccountBalanceWallet, MdReceiptLong } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersOfShop } from '../../redux/actions/order'
import { getAllProductsShop } from '../../redux/actions/product'

// Gives colors for each order status badge
const getStatusStyle = (status) => {
  if (status === "Delivered") {
    return { badge: "bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" };
  }
  if (status === "Processing refund") {
    return { badge: "bg-orange-50 text-orange-800", dot: "bg-orange-500" };
  }
  if (status === "Refund Success") {
    return { badge: "bg-blue-50 text-blue-800", dot: "bg-blue-500" };
  }
  // all other statuses (Processing, Shipping, etc.)
  return { badge: "bg-amber-50 text-amber-800", dot: "bg-amber-500" };
};

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const [deliveredOrder, setDeliveredOrder] = useState(null)

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));

    const orderData = orders && orders.filter((item) => item.status === "Delivered");
    setDeliveredOrder(orderData);
  },[dispatch]);

  const totalEarningWithoutTax = deliveredOrder ? deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0) : 0;

  const serviceCharge = totalEarningWithoutTax * 0.1 || 0;
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2) || 0;

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
    <div className="flex-1 min-w-0 p-space-md 800px:p-space-lg space-y-space-lg">

      {/* Page heading */}
      <div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
          Store Hub
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
          Overview
        </h1>
      </div>

      {/* Cards of Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">

        {/* Account Balance */}
        <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                Account Balance
              </span>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5">
                (with 10% service charge)
              </span>
            </div>
            <div className="w-12 h-12 shrink-0 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <MdOutlineAccountBalanceWallet size={24} />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-hero text-[34px] leading-tight font-extrabold text-on-surface tracking-tight break-words">
              ${availableBalance}
            </span>
          </div>
          <Link
            to="/dashboard-withdraw-money"
            className="mt-space-lg inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
          >
            <span>Withdraw Money</span>
            <AiOutlineArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* All orders */}
        <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                All Orders
              </span>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5">
                Orders from your customers
              </span>
            </div>
            <div className="w-12 h-12 shrink-0 rounded-xl bg-secondary-container flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <FiShoppingBag size={24} />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-hero text-[34px] leading-tight font-extrabold text-on-surface tracking-tight">
              {orders && orders.length}
            </span>
          </div>
          <Link
            to="/dashboard-orders"
            className="mt-space-lg inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
          >
            <span>View Orders</span>
            <AiOutlineArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* All Products */}
        <div className="group flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                All Products
              </span>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5">
                Products in your shop
              </span>
            </div>
            <div className="w-12 h-12 shrink-0 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary-container group-hover:scale-105 transition-transform">
              <FiPackage size={24} />
            </div>
          </div>
          <div className="mt-space-md">
            <span className="font-display-hero text-[34px] leading-tight font-extrabold text-on-surface tracking-tight">
              {products && products.length}
            </span>
          </div>
          <Link
            to="/dashboard-products"
            className="mt-space-lg inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
          >
            <span>View Products</span>
            <AiOutlineArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Latest Orders */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container/80 shadow-sm overflow-hidden">
        <div className="p-space-lg">
          <div className="flex items-center gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
              Latest Orders
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
              {row.length} Total
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            All customer orders and their delivery status.
          </p>
        </div>

        {/* This box scrolls sideways on small screens */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 px-space-lg font-semibold">Order ID</th>
                <th className="py-3 px-space-md font-semibold">Status</th>
                <th className="py-3 px-space-md font-semibold text-center">Items Qty</th>
                <th className="py-3 px-space-md font-semibold text-right">Total</th>
                <th className="py-3 px-space-lg font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container text-on-surface font-body-md text-body-md">
              {row.map((item) => {
                const statusStyle = getStatusStyle(item.status);
                return (
                  <tr key={item.id} className="group hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-4 px-space-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 shrink-0 rounded-md bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary-fixed group-hover:text-primary transition-colors">
                          <MdReceiptLong size={16} />
                        </span>
                        <span className="font-semibold text-on-surface max-w-[140px] sm:max-w-[220px] truncate">
                          {item.id}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-space-md">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-semibold ${statusStyle.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-space-md text-center font-medium">
                      {item.itemsQty}
                    </td>
                    <td className="py-4 px-space-md text-right font-headline-sm text-[16px] font-bold">
                      {item.total}
                    </td>
                    <td className="py-4 px-space-lg text-right">
                      <Link
                        to={`/order/${item.id}`}
                        title="View Order Details"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all duration-200"
                      >
                        <AiOutlineArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {row.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-secondary font-body-md text-body-md">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default DashboardHero