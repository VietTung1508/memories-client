import axiosClient from "../../api/axiosClient";
import Loading from "../../pages/loading/Loading";
import "./editModal.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function EditModal(props) {
  const post = props.post;
  const setPostEditModal = props.setPostEditModal;
  const update = props.update;
  const setUpdate = props.setUpdate;
  const [postDeleteModal, setPostDeleteModal] = useState(false);
  const [value, setValue] = useState({
    title: post.title,
    content: post.content,
    category: post.category,
    author: post.author,
  });
  const [loading, setLoading] = useState(false);

  const rememberMe = useSelector((state) => state.user.rememberMe);

  const token = useSelector((state) => {
    if (rememberMe) {
      return state.user.token;
    } else {
      return state.tempUser.token;
    }
  });

  const navigate = useNavigate();

  const handleValue = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`posts/${post._id}`, value, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpdate(!update);
      setPostEditModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteModal = (e) => {
    e.preventDefault();
    setPostDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosClient.delete(`posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="post-edit-modal-wrapper">
      {postDeleteModal && !loading && (
        <div className="post-confirm-delete-wrapper">
          <div className="post-confirm-delete-modal">
            <h1>Are you sure?</h1>
            <p>You cannot redo this action after delete it!</p>
            <div className="actions">
              <button
                className="btn-cancle"
                onClick={() => {
                  setPostDeleteModal(false);
                }}
              >
                Cancle
              </button>
              <button
                className="btn-delete"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <Loading isDelete />
      ) : (
        <div className="post-edit-modal">
          <h1>Edit Pin</h1>
          <form className="post-edit-form">
            <div className="form-box">
              <div className="form-box-info">
                <div className="form-box-info-item">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={value.title}
                    onChange={handleValue}
                    required
                  />
                </div>
                <div className="form-box-info-item">
                  <label htmlFor="content">Content</label>
                  <input
                    type="text"
                    name="content"
                    id="content"
                    value={value.content}
                    onChange={handleValue}
                  />
                </div>
                <div className="form-box-info-item">
                  <label htmlFor="category">Category</label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={value.category}
                    onChange={handleValue}
                    required
                  />
                </div>
              </div>
              <div className="form-box-img">
                <img src={post.image.url} alt="" />
                <p>Sorry but you cannot change the image.</p>
              </div>
            </div>
            <div className="post-edit-modal-actions">
              <div className="action-left">
                <button onClick={handleDeleteModal} type="button">
                  Delete
                </button>
              </div>
              <div className="action-right">
                <button
                  onClick={() => setPostEditModal(false)}
                  className="btn-cancle"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditModal;
