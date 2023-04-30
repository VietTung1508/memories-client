import { Fragment, useEffect, useState } from "react";
import "./upload.scss";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";

function Upload() {
  const [postImage, setPostImage] = useState(null);
  const [error, setError] = useState(null);
  const [value, setValue] = useState({
    title: "",
    image: "",
    content: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
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

  useEffect(() => {
    return () => {
      postImage && URL.revokeObjectURL(postImage);
    };
  }, [postImage]);

  const handlePreImage = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    setPostImage(img);
    setValue({ ...value, image: e.target.files[0] });
  };

  const handleChangeValue = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    data.append("title", value.title);
    data.append("image", value.image);
    data.append("content", value.content);
    data.append("category", value.category.toLowerCase().trim());
    try {
      await axios.post(
        `https://memories-api-1an9.onrender.com/posts/create`,
        data,
        {
          "content-type": "multipart/form-data",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLoading(false);
      navigate("/");
    } catch (e) {
      setIsLoading(false);
      setError(e.response.data.msg);
      console.log(e);
    }
  };

  return (
    <div className="upload container">
      {isLoading ? (
        <Loading isUpload />
      ) : (
        <form
          className="form-upload"
          onSubmit={handleUpload}
          encType="multipart/form-data"
        >
          <div className="upload-img-wrapper">
            {!postImage ? (
              <label htmlFor="image" className="upload-noImage">
                <input
                  type="file"
                  className="inp-image"
                  name="image"
                  id="image"
                  onInput={handlePreImage}
                />
                <label htmlFor="image">
                  <FontAwesomeIcon
                    className="upload-icon"
                    icon={faCircleArrowUp}
                  />
                </label>
                <h3>Click on to upload image !</h3>
              </label>
            ) : (
              <Fragment>
                <img src={postImage} alt="" className="post-image" />
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="delete-icon"
                  onClick={() => {
                    setPostImage(null);
                  }}
                />
              </Fragment>
            )}
          </div>
          <div className="upload-info">
            <input
              type="text"
              name="title"
              className="inp-title"
              placeholder="Add your title"
              autoComplete="off"
              value={value.title}
              onChange={handleChangeValue}
              required
            />
            <div className="upload-author">
              {user.avatar ? (
                <div className="avatar">
                  <img src={user.avatar.url} alt="" draggable="false" />
                </div>
              ) : (
                <div className="anonymous-avatar">
                  <span>{user.username[0].toUpperCase()}</span>
                </div>
              )}
              <h4 className="author-username">{user && user.username}</h4>
            </div>
            <input
              type="text"
              name="content"
              className="inp-content"
              placeholder="Tell everyone what your pin is about"
              autoComplete="off"
              value={value.content}
              onChange={handleChangeValue}
            />
            <input
              type="text"
              name="category"
              className="inp-category"
              placeholder="Add category"
              autoComplete="off"
              required
              value={value.category}
              onChange={handleChangeValue}
            />
            {error && <span className="upload-error">{error}</span>}
            <button className="btn-upload" type="submit">
              Upload
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Upload;
