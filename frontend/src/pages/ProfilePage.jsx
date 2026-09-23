import { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSideBar";
import ProfileContent from "../components/Profile/ProfileContent.jsx";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  
  // useLocation is a React Router hook. It gives you information about the current URL/page you're on — including any extra data that was passed along when navigating here. 
  
  // Calling this hook gives you a location object with several properties, like:
  // {pathname: "/profile", search: "", hash: "", state: { ... },   // <-- this is the important one here! key:" "}
  
  const location = useLocation();

  const [active, setActive] = useState(1);
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header />
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10 items-start`}>
        <div className="w-[50px] 800px:w-[335px] sticky mt-[18%] 800px:mt-0">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
          <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
