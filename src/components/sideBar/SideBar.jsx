import "./sideBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus, faBars } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSideBar, openSideBar } from "../../redux/modeSlice";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const pages = [
  {
    icon: faHouse,
    page: "Home",
    path: "/",
  },
  {
    icon: faPlus,
    page: "Upload",
    path: "/upload",
  },
  {
    icon: faUser,
    page: "Following",
    path: "/following",
  },
];

function SideBar() {
  const [categories, setCategories] = useState(null);
  const { pathname } = useLocation();
  const sidebar = useSelector((state) => state.mode.sideBar);
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 600) {
      setIsMobile(true);
      dispatch(openSideBar());
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await axiosClient.get("categories/");
        setCategories(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getCategories();
  }, []);

  const handleSidebar = () => {
    dispatch(setSideBar());
  };

  return (
    <div className={`sidebar ${sidebar ? "" : "close"}`}>
      <div className="sidebar__topSidebar">
        <FontAwesomeIcon
          className="bar"
          icon={faBars}
          onClick={handleSidebar}
        />
        <Link to="/">
          <div className="brand">
            <img className="logo" src="/images/logo.png" alt="" />
            <h4 className="brandName">MEMORIES</h4>
          </div>
        </Link>
      </div>
      <div className="sidebar__pages">
        {pages.map((page, id) => (
          <Link to={page.path} key={id}>
            <div
              className={`sidebar__pages__page ${
                pathname === page.path ? "active" : ""
              }`}
            >
              <FontAwesomeIcon className="icon" icon={page.icon} />
              <h3>{page.page}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="sidebar__categories">
        <h4 className="sidebar__categories__title">Discovery Categories</h4>
        {categories &&
          categories.map((category, id) => (
            <Link to={`/?category=${category.category.toLowerCase()}`} key={id}>
              <div className="sidebar__categories__category">
                <img className="cate-img" src={category.image.url} alt="" />
                <h4 className="cate-title">
                  {category.category[0].toUpperCase() +
                    category.category.slice(1)}
                </h4>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default SideBar;
