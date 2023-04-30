import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./searchItem.scss";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function SearchItem(props) {
  const item = props.data;
  const setSearchArray = props.setSearchArray;
  const setSearch = props.setSearch;

  const handleNavigate = () => {
    setSearchArray([]);
    setSearch("");
  };

  return (
    <Link
      to={`/${item.username ? "user" : "posts"}/${item._id}`}
      onClick={handleNavigate}
    >
      <div className="search-item">
        {item.username ? (
          item.avatar ? (
            <div className="user-avatar">
              <img src={item.avatar.url} alt="" />
            </div>
          ) : (
            <div className="user-avatar-anonymous">
              <span>{item.username[0].toUpperCase()}</span>
            </div>
          )
        ) : (
          <div className="search-item-icon">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
          </div>
        )}
        <div className="search-item-info">
          <h1 className="title">{item.title || item.username}</h1>
          <h3 className="username">{item.email || item.author.username}</h3>
        </div>
      </div>
    </Link>
  );
}

export default SearchItem;
