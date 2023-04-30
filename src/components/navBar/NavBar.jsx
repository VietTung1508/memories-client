import {
  faMagnifyingGlass,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import "./navBar.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import SearchItem from "../searchItem/SearchItem";
import { useLocation } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { tempLogout } from "../../redux/tempUserSlice";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [search, setSearch] = useState("");
  const [searchArray, setSearchArray] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const [shrink, setShrink] = useState(false);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebar = useSelector((state) => state.mode.sideBar);
  const rememberMe = useSelector((state) => state.user.rememberMe);
  const user = useSelector((state) => {
    if (rememberMe) {
      if (state.user.user === null) {
        return state.user.user;
      } else if (state.user.user !== null && !state.user.user.user) {
        return state.user.user;
      } else {
        return state.user.user.user;
      }
    } else {
      if (state.tempUser.user === null) {
        return state.tempUser.user;
      } else if (state.tempUser.user !== null && !state.tempUser.user.user) {
        return state.tempUser.user;
      } else {
        return state.tempUser.user.user;
      }
    }
  });

  useEffect(() => {
    setUserMenu(false);
  }, [path]);

  useEffect(() => {
    const shrinkHeader = () => {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    };
    window.addEventListener("scroll", shrinkHeader);
    return () => {
      window.removeEventListener("scroll", shrinkHeader);
    };
  }, []);

  useEffect(() => {
    const getSearch = setTimeout(async () => {
      if (search === "" || search.trim() === "") return;
      const res = await axiosClient.get(
        `posts/search/?q=${search}&limit=${true}`
      );
      setSearchArray(res.data);
    }, 500);

    return () => {
      clearTimeout(getSearch);
    };
  }, [search]);

  const handleLogOut = () => {
    if (rememberMe) {
      dispatch(logout());
    } else {
      dispatch(tempLogout());
    }
    setUserMenu(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (search === "" || search.trim() === "") return;
    navigate(`/?q=${search}`);
    setSearch("");
  };

  const handleMenu = () => {
    setUserMenu(!userMenu);
  };

  const handleSearchWrapper = () => {
    setSearch("");
    setUserMenu(false);
  };

  const handleUserMenuWrapper = () => {
    setUserMenu(false);
  };

  return (
    <div className={`navBar ${shrink && `shrink ${sidebar ? "sb" : "noSb"}`}`}>
      <div
        className={`navBar-search-wrapper ${
          searchArray && searchArray.length > 0 && search && "active"
        }`}
        onClick={handleSearchWrapper}
      />
      <div
        className={`navBar-userMenu-wrapper ${userMenu && "active"}`}
        onClick={handleUserMenuWrapper}
      />
      <form className="navBar__search" onSubmit={handleSubmitSearch}>
        <div className="search-box">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            autoComplete="off"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <FontAwesomeIcon
              onClick={() => setSearch("")}
              className="delete-icon"
              icon={faXmark}
            />
          )}
        </div>
        <button className="btn-search" type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
        </button>
        {searchArray &&
          search.trim().length !== 0 &&
          searchArray.length > 0 && (
            <div className="search-results">
              {searchArray.map((item, i) => (
                <SearchItem
                  data={item}
                  key={i}
                  setSearchArray={setSearchArray}
                  setSearch={setSearch}
                />
              ))}
            </div>
          )}
      </form>

      <div className="navBar__action">
        <Link to="/upload">
          <button className="btn-upload">
            <FontAwesomeIcon className="btn-upload-icon" icon={faPlus} />
          </button>
        </Link>

        {user ? (
          <div className="user-wrapper">
            {user.avatar ? (
              <div className="avatar" onClick={handleMenu}>
                <img src={user.avatar.url} alt="" draggable="false" />
              </div>
            ) : (
              <div className="anonymous-avatar" onClick={handleMenu}>
                <span>{user.username[0].toUpperCase()}</span>
              </div>
            )}
            {userMenu && (
              <div className="userMenu">
                <Link to={`/user/${user._id}`}>
                  <div className="userMenu__user">
                    {user.avatar ? (
                      <div className="avatar-menu">
                        <img src={user.avatar.url} alt="" draggable="false" />
                      </div>
                    ) : (
                      <div className="anonymous-avatar-menu">
                        <span>{user.username[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="user-menu-info">
                      <h3 className="user-menu-username">{user.username}</h3>
                      <p className="user-menu-email">{user.email}</p>
                    </div>
                  </div>
                </Link>
                <p className="divide-menu">Your account</p>
                <div className="user-options">
                  <Link to="/upload">
                    <div className="userMenu__item">
                      <h3>Upload</h3>
                    </div>
                  </Link>
                  <Link to="/profileSetting">
                    <div className="userMenu__item">
                      <h3>Profile Settings</h3>
                    </div>
                  </Link>
                  <Link to="/following">
                    <div className="userMenu__item">
                      <h3>Following</h3>
                    </div>
                  </Link>
                </div>
                <p className="divide-menu">Another options</p>
                <div className="another-options">
                  <div className="userMenu__item" onClick={handleLogOut}>
                    <h3>Log out</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="btn-login">Log in</button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
