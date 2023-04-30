import "./user.scss";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Link, useParams } from "react-router-dom";
import Masonary from "../../components/masonary/Masonary";
import { useSelector } from "react-redux";

function User() {
  const [user, setUser] = useState(null);
  const [createdPin, setcreatedPin] = useState(true);
  const [following, setFollowing] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const { userId } = useParams();

  const rememberMe = useSelector((state) => state.user.rememberMe);
  const currentUser = useSelector((state) => {
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
    if (following && user) {
      setIsFollowed(following.some((el) => el._id === user._id));
    }
  }, [following, user]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosClient.get(`users/${userId}`);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();

    return () => {
      setUser(null);
    };
  }, [userId]);

  useEffect(() => {
    if (!currentUser) return;
    const getUser = async () => {
      try {
        const res = await axiosClient.get(`users/${currentUser._id}`);
        setFollowing(res.data.following);
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, [currentUser]);

  const handleFollow = async () => {
    try {
      await axiosClient.post(`users/follow/${user._id}`, {
        userId: currentUser._id,
      });
      setIsFollowed(!isFollowed);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="userPage">
      {user && (
        <div className="user ">
          {user.avatar ? (
            <div className="user-avatar">
              <img
                className="user-avatar-img"
                src={user.avatar.url}
                alt=""
                draggable="false"
              />
            </div>
          ) : (
            <div className="user-anonymous-avatar">
              <span>{user.username[0].toUpperCase()}</span>
            </div>
          )}
          <div className="user-info">
            <h1 className="username">{user.username}</h1>
            <p className="email">{user.email}</p>
            <p className="followers">{user.followers} followers</p>
            <p className="introduction">{user.introduction}</p>
            <div className="user-actions">
              {currentUser._id === user._id ? (
                <Link to="/profileSetting">
                  <button>Edit Profile</button>
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`btn-follow ${isFollowed && "active"}`}
                >
                  {isFollowed ? "Followed" : "Follow"}
                </button>
              )}
            </div>
            <div className="user-filter-pin">
              <button
                className={`btn-created ${createdPin ? "active" : ""}`}
                onClick={() => {
                  setcreatedPin(true);
                }}
              >
                Created
              </button>
              <button
                className={`btn-saved ${createdPin ? "" : "active"}`}
                onClick={() => {
                  setcreatedPin(false);
                }}
              >
                Saved
              </button>
            </div>
          </div>
          <Masonary user={user} savePin={!createdPin && user.savedPin} />
        </div>
      )}
    </div>
  );
}

export default User;
