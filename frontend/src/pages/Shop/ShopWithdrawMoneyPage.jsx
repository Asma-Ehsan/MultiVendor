import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";

const ShopWithdrawMoneyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[280px] shrink-0">
          <DashboardSideBar active={7} />
        </div>
        <WithdrawMoney />
      </div>
    </div>
  );
};

export default ShopWithdrawMoneyPage;
