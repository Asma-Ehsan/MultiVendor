import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero.jsx";

const ShopDashboardPage = () => {
  return (
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="flex items-start w-full">
            <div className="w-[80px] 800px:w-[280px] shrink-0">
              <DashboardSideBar active={1} />
            </div>
            <DashboardHero />
          </div>
        </div>
  );
};

export default ShopDashboardPage;