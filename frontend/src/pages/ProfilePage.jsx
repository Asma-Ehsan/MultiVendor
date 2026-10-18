import { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSideBar";
import ProfileContent from "../components/Profile/ProfileContent.jsx";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const location = useLocation();
   const [active, setActive] = useState(location?.state?.active || 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-[1320px] mx-auto w-full px-margin-mobile lg:px-margin py-8 lg:py-12 flex items-start gap-4 800px:gap-8">
        <div className="w-[64px] 800px:w-[280px] shrink-0 sticky top-44">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
