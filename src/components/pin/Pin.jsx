import "./pin.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

function Pin(props) {
  const pin = props.data;
  const savedPin = props.savedPin;
  const refData = props.refData;
  const currentUser = props.currentUser;
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (savedPin && pin) {
      setIsSaved(savedPin.some((el) => el._id === pin._id));
    }
  }, [savedPin, pin]);

  const handleSavedPin = async () => {
    try {
      await axiosClient.post(`users/${pin._id}`, { userId: currentUser._id });
      setIsSaved(!isSaved);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="pin" ref={refData ? refData : null}>
      <div className="pin__actions">
        <a href={pin.image.url}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pin-download" />
        </a>
        {currentUser && (
          <button
            className={`pin-save ${isSaved && "active"}`}
            onClick={handleSavedPin}
          >
            {isSaved ? "Saved" : "Save"}
          </button>
        )}
      </div>
      <Link to={`/posts/${pin._id}`}>
        <img src={pin.image.url} alt="" className="pin__img" loading="lazy" />
      </Link>

      <div className="pin__info">
        <Link to={`/user/${pin.author._id}`}>
          {pin.author.avatar ? (
            <div className="pin-user">
              <div className="pin-user-avatar">
                <img src={pin.author.avatar.url} alt="" draggable="false" />
              </div>
              <h5 className="pin-user-username">{pin.author.username}</h5>
            </div>
          ) : (
            <div className="pin-user">
              <div className="pin-user-anonymous-avatar">
                <span>{pin.author.username[0].toUpperCase()}</span>
              </div>
              <h5 className="pin-user-username">{pin.author.username}</h5>
            </div>
          )}
        </Link>
        {pin.title.length > 7 ? (
          <h4 className="pin-title">- {pin.title.slice(0, 6)}...</h4>
        ) : (
          <h4 className="pin-title">- {pin.title}</h4>
        )}
      </div>
    </div>
  );
}

export default Pin;
