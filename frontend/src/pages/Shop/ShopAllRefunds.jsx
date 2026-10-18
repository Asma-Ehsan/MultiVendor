import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllRefundOrder from "../../components/Shop/AllRefundOrder";

const ShopAllRefunds = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[280px] shrink-0">
          <DashboardSideBar active={10} />
        </div>
        <div className="w-full justify-center flex">
          <AllRefundOrder />
        </div>
      </div>
    </div>
  );
};

export default ShopAllRefunds;
