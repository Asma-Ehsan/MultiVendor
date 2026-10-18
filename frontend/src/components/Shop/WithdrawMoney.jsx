import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

const WithdrawMoney = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [deliveredOrder, setDeliveredOrder] = useState(null);
  const { seller } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));

    const orderData =
      orders && orders.filter((item) => item.status === "Delivered");
    setDeliveredOrder(orderData);
  }, [dispatch]);

  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + item.totalPrice, 0);

  const serviceCharge = totalEarningWithoutTax * 0.1;
  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2);

  return (
  <div className="w-full min-w-0 p-space-md 800px:p-space-lg">
    {/* ---------- Page heading ---------- */}
    <div className="mb-space-md">
      <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
        Finances
      </span>
      <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
        Withdraw Money
      </h2>
    </div>

    {/* ---------- Card ---------- */}
    <div className="max-w-md mx-auto bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-space-lg text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
        <MdOutlineAccountBalanceWallet size={32} />
      </div>

      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
        Available Balance
      </span>
      <h5 className="font-display-hero text-[34px] leading-tight font-extrabold text-on-surface tracking-tight break-words mt-1">
        ${availableBalance}
      </h5>

      <button
        type="button"
        className="mt-space-lg w-full px-6 py-3 rounded-xl bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-primary transition-all duration-300 shadow-md hover:shadow-lg"
      >
        Withdraw
      </button>
    </div>
  </div>
);
};

export default WithdrawMoney;
