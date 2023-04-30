import "./detail.scss";
import axiosClient from "../../api/axiosClient";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Masonary from "../../components/masonary/Masonary";
import { useSelector } from "react-redux";
import Comment from "../../components/comment/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
  faMagnifyingGlass,
  faPaperPlane,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import EditModal from "../../components/editModal/EditModal";

function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [newComment, setNewComment] = useState(false);
  const [activeComment, setActiveComment] = useState(null);
  const [hideComment, setHideComment] = useState(false);
  const [postEditModal, setPostEditModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [savePin, setSavePin] = useState(null);
  const [isSaved, setIsSaved] = useState(null);
  const [isFollowed, setIsFollowed] = useState(null);
  const [following, setFollowing] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({
    modal: false,
    id: null,
  });
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
    if (following && post) {
      setIsFollowed(following.some((el) => el._id === post.author._id));
    }
  }, [following, post]);

  useEffect(() => {
    if (savePin && post) {
      setIsSaved(savePin.some((el) => el._id === post._id));
    }
  }, [savePin, post]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axiosClient.get(`posts/${id}`);
        setPost(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    getPost();
  }, [id, newComment, update]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!user) return;
    const getUser = async () => {
      try {
        const res = await axiosClient.get(`users/${user._id}`);
        setSavePin(res.data.savedPin);
        setFollowing(res.data.following);
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, [user]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const cmt = comment;
    if (cmt === "" || cmt === " ") return;
    try {
      await axiosClient.post(
        `comments/${post._id}`,
        {
          author: user._id,
          content: cmt,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComment("");
      setNewComment(!newComment);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmitDelete = async () => {
    const commentId = confirmDeleteModal.id;
    const isChild = confirmDeleteModal.isChild;
    try {
      await axiosClient.delete(
        `comments/${commentId}?isChild=${isChild ? true : false}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewComment(!newComment);
      setConfirmDeleteModal(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSavePin = async (e) => {
    try {
      await axiosClient.post(`users/${post._id}`, { userId: user._id });
      setIsSaved(!isSaved);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFollow = async () => {
    try {
      await axiosClient.post(`users/follow/${post.author._id}`, {
        userId: user._id,
      });
      setIsFollowed(!isFollowed);
    } catch (e) {
      console.log(e);
    }
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="wrapper">
      {confirmDeleteModal && confirmDeleteModal.modal && (
        <div className="delete-modal-wrapper">
          <div className="delete-modal">
            <h4 className="delete-modal-title">Delete Comment !</h4>
            <p className="delete-modal-msg">
              Do you want to permanently delete this comment.
            </p>
            <div className="delete-modal-actions">
              <button
                onClick={() => {
                  setConfirmDeleteModal(false);
                }}
                className="btn-cancle"
              >
                Cancle
              </button>
              <button onClick={handleSubmitDelete} className="btn-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {postEditModal && (
        <EditModal
          post={post}
          setPostEditModal={setPostEditModal}
          setUpdate={setUpdate}
          update={update}
        />
      )}
      <div className="detail">
        {loading ? <h1>Loading...</h1> : ""}
        {post && (
          <div className="detail__box container">
            <div className="post-img-wrapper">
              <img className="post-img" src={post.image.url} alt="" />
            </div>
            <div className="post-info">
              {user ? (
                <div className="post-action">
                  <div className="icons">
                    {user._id === post.author._id && (
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="post-icon"
                        onClick={() => {
                          setPostEditModal(!postEditModal);
                        }}
                      />
                    )}
                    <a href={post.image.url}>
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="post-icon
                    "
                      />
                    </a>
                  </div>
                  <button
                    className={`btn-save ${isSaved ? "saved" : ""}`}
                    onClick={handleSavePin}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              ) : (
                <div className="post-action">
                  <div className="icons">
                    <a href={post.image.url}>
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="post-icon
                  "
                      />
                    </a>
                  </div>
                  <h3>
                    Log In to save this Pin! <Link to="/login">Log In</Link>
                  </h3>
                </div>
              )}

              <div className="content">
                <h1 className="post-title">{post.title}</h1>

                {post.content && <p className="post-content">{post.content}</p>}
              </div>
              <div className="post-user">
                <div className="user-info">
                  <Link to={`/user/${post.author._id}`}>
                    {post.author.avatar ? (
                      <div className="post-avatar">
                        <img
                          src={post.author.avatar.url}
                          alt=""
                          draggable="false"
                        />
                      </div>
                    ) : (
                      <div className="post-anonymous-avatar">
                        <span>{post.author.username[0].toUpperCase()}</span>
                      </div>
                    )}
                  </Link>
                  <div>
                    <Link to={`/user/${post.author._id}`}>
                      <h4 className="author">{post.author.username}</h4>
                    </Link>
                    <p className="followers">
                      {post.author.followers === 0
                        ? "No one follow yet"
                        : `${post.author.followers} followers`}
                    </p>
                  </div>
                </div>
                {user && user._id !== post.author._id && (
                  <button
                    className={`btn-follow ${isFollowed && "active"}`}
                    onClick={handleFollow}
                  >
                    {isFollowed ? "Followed" : "Follow"}
                  </button>
                )}
              </div>
              <div className="comments">
                <h3>
                  Comments{" "}
                  {post && post.comments.length > 0 && (
                    <span>
                      <FontAwesomeIcon
                        icon={hideComment ? faChevronDown : faChevronRight}
                        onClick={() => setHideComment(!hideComment)}
                      />
                    </span>
                  )}
                </h3>
                {user && (
                  <form className="comments__action">
                    {user.avatar ? (
                      <div className="user-avatar">
                        <img src={user.avatar.url} alt="" draggable="false" />
                      </div>
                    ) : (
                      <div className="user-anonymous-avatar">
                        <span>{user.username[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="comment-wrapper">
                      <input
                        className="comment-inp"
                        value={comment}
                        onChange={handleComment}
                        placeholder="Add a comment"
                      />
                    </div>
                    <button
                      className="btn-comment"
                      onClick={handleSubmitComment}
                      type="submit"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </form>
                )}
                <div
                  className={`comments__comments ${hideComment ? "hide" : ""}`}
                >
                  {post &&
                    post.comments.length > 0 &&
                    post.comments.map((comment, id) => (
                      <Comment
                        key={id}
                        comment={comment}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        setConfirmDeleteModal={setConfirmDeleteModal}
                      />
                    ))}
                  {!user && post && post.comments.length === 0 && (
                    <h4 className="no-Comment">
                      Log in to be the first one comment !
                      <Link to="/login">
                        <span className="link-login">Log in</span>
                      </Link>
                    </h4>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <h3 className="wrapper__similar">Similar Pin</h3>
      {post && <Masonary category={post.category} />}
    </div>
  );
}

export default Detail;
