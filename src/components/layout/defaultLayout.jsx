import SideBar from "../sideBar/SideBar";
import NavBar from "../navBar/NavBar";
import "./defaultLayout.scss";
import { useSelector } from "react-redux";

function DefaultLayout({ children }) {
  const sidebar = useSelector((state) => state.mode.sideBar);
  return (
    <div className="wrapper">
      <SideBar />
      <div className={`wrapper__content ${sidebar ? "" : "noSideBar"}`}>
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
