import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1320px] mx-auto w-full px-margin-mobile lg:px-margin py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: shop info card (sticks while you scroll on big screens) */}
          <div className="lg:col-span-3 lg:sticky lg:top-6">
            <ShopInfo isOwner={true} />
          </div>

          {/* Right: tabs */}
          <div className="lg:col-span-9 min-w-0">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage