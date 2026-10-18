import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import CreateProduct from "../../components/Shop/CreateProduct.jsx";

const ShopCreateProduct = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[280px] shrink-0">
          <DashboardSideBar active={4} />
        </div>
        <div className="w-full justify-center flex">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateProduct;
