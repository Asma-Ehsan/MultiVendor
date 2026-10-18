import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopInbox from "../../components/Shop/ShopInbox.jsx";

const ShopInboxPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[280px] shrink-0">
          <DashboardSideBar active={8} />
        </div>
        <ShopInbox />
      </div>
    </div>
  );
};

export default ShopInboxPage;
