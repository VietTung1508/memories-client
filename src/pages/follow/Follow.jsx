import Masonary from "../../components/masonary/Masonary";
import "./follow.scss";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../api/axiosClient";

function Follow() {
  const [following, setFollowing] = useState(null);
  const [unfollow, setUnfollow] = useState(false);

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
    if (!user) return;
    const getUser = async () => {
      try {
        const res = await axiosClient.get(`users/${user._id}`);
        setFollowing(res.data.following);
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, [user, unfollow]);

  const handleUnfollow = async (id) => {
    try {
      await axiosClient.post(`users/follow/${id}`, {
        userId: user._id,
      });
      setUnfollow(!unfollow);
    } catch (e) {}
  };

  return (
    <Fragment>
      {following && following.length > 0 ? (
        <div className="follow">
          <div className="follow-box">
            {following.map((followUser, id) => (
              <div key={id} className="follow-user">
                {followUser.avatar ? (
                  <div className="user-avatar">
                    <img src={followUser.avatar.url} alt="" draggable="false" />
                  </div>
                ) : (
                  <div className="user-anonymous-avatar">
                    <span>{followUser.username[0].toUpperCase()}</span>
                  </div>
                )}
                <div className="user-info">
                  <h5 className="username">{followUser.username}</h5>
                </div>
                <button
                  className="btn-unfollow"
                  onClick={() => {
                    handleUnfollow(followUser._id);
                  }}
                >
                  Unfollow
                </button>
              </div>
            ))}
          </div>
          <div className="follow-pins">
            <Masonary followPage following={following} />
          </div>
        </div>
      ) : (
        <Fragment>
          {following && (
            <div className="noFollowing">
              <img src="./images/follow.png" alt="" />
              <h1>You are not following anyone yet !</h1>
              <p>Follow people to see the stories they're </p>
              <p>collecting</p>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

export default Follow;
