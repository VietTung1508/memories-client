import "./profileSetting.scss";
import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Loading from "../loading/Loading";
import { loginStart, loginSuccess, loginFailure } from "../../redux/userSlice";
import {
  tempLoginStart,
  tempLoginSuccess,
  tempLoginFailure,
} from "../../redux/tempUserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProfileSetting() {
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
  const token = useSelector((state) => {
    if (rememberMe) {
      return state.user.token;
    } else {
      return state.tempUser.token;
    }
  });

  const [tempAvatar, setTempAvatar] = useState(null);
  const [inpValue, setInpValue] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    avatar: user.avatar || "",
    introduction: user.introduction || "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleValue = (e) => {
    setInpValue({ ...inpValue, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    return () => {
      tempAvatar && URL.revokeObjectURL(tempAvatar);
    };
  }, [tempAvatar]);

  const handleAvatar = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setTempAvatar(img);
    setInpValue({ ...inpValue, avatar: e.target.files[0] });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setInpValue({
      ...inpValue,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      introduction: user.introduction || "",
    });
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    if (rememberMe) {
      dispatch(loginStart);
    } else {
      dispatch(tempLoginStart);
    }
    try {
      const data = new FormData();
      data.append("firstname", inpValue.firstname);
      data.append("lastname", inpValue.lastname);
      data.append("username", inpValue.username);
      data.append("introduction", inpValue.introduction);
      tempAvatar && data.append("avatar", inpValue.avatar);

      const res = await axios.put(
        `https://memories-api-1an9.onrender.com/users/`,
        data,
        {
          "content-type": "multipart/form-data",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsUpdating(false);
      if (rememberMe) {
        dispatch(loginSuccess({ user: res.data, token }));
      } else {
        dispatch(tempLoginSuccess({ user: res.data, token }));
      }
      navigate(`/user/${user._id}`);
    } catch (e) {
      console.log(e);
      setIsUpdating(false);
      if (rememberMe) {
        dispatch(loginFailure);
      } else {
        dispatch(tempLoginFailure);
      }
    }
  };

  return (
    <Fragment>
      {isUpdating ? (
        <Loading isUpdated />
      ) : (
        <div className="profile-setting">
          <h1>Public Profile</h1>
          <p>
            People who visiting your profile will see the following information
          </p>
          <div className="profile-setting-img">
            <h5>Avatar</h5>
            <div className="setting-img-wrapper">
              {tempAvatar ? (
                <img className="temp-avatar" src={tempAvatar} alt="" />
              ) : (
                <Fragment>
                  {user.avatar ? (
                    <div className="avatar">
                      <img src={user.avatar.url} alt="" draggable="false" />
                    </div>
                  ) : (
                    <div className="anonymous-avatar">
                      <span>{user.username[0].toUpperCase()}</span>
                    </div>
                  )}
                </Fragment>
              )}
              <label htmlFor="file" className="btn-change">
                Change
              </label>
              <input
                className="inp-file"
                type="file"
                id="file"
                name="avatar"
                onChange={handleAvatar}
              />
            </div>
          </div>
          <form className="profile-setting-info" onSubmit={handleEditProfile}>
            <div className="profile-setting-firstlast">
              <div className="info-fisrtname">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={inpValue.firstname}
                  onChange={handleValue}
                  required
                />
              </div>
              <div className="info-lastname">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={inpValue.lastname}
                  onChange={handleValue}
                  required
                />
              </div>
            </div>
            <div className="profile-setting-username">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                value={inpValue.username}
                onChange={handleValue}
                required
              />
            </div>
            <div className="profile-setting-introduction">
              <label htmlFor="introduction">Introduction</label>
              <textarea
                type="text"
                name="introduction"
                id="introduction"
                placeholder="Tell everyone your story."
                value={inpValue.introduction}
                onChange={handleValue}
              />
            </div>
            <div className="profile-setting-actions">
              <button className="btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button className="btn-save" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </Fragment>
  );
}

export default ProfileSetting;
