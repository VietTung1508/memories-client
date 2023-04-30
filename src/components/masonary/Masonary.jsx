import Pin from "../pin/Pin";
import "./masonary.scss";
import axiosClient from "../../api/axiosClient";
import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

function Masonary(props) {
  const category = props.category;
  const savePin = props.savePin;
  const user = props.user;
  const followingPin = props.following;
  const followPage = props.followPage;
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [savedPin, setSavdPin] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const sidebar = useSelector((state) => state.mode.sideBar);

  const { q } = queryString.parse(location.search);

  const observer = useRef();

  const lastPin = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setPageNumber(0);
    setPosts([]);
  }, [category, q, followingPin]);

  useEffect(() => {
    if (!currentUser) return;
    const getUser = async () => {
      try {
        const res = await axiosClient.get(`users/${currentUser._id}`);
        setSavdPin(res.data.savedPin);
      } catch (e) {
        console.log(e);
      }
    };

    getUser();
  }, [currentUser]);

  let shuffledPosts;

  if (posts) {
    shuffledPosts = posts
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  useEffect(() => {
    setLoading(true);
    const getPosts = async () => {
      try {
        let res;
        if (category) {
          res = await axiosClient.get(
            `posts/?category=${category.toLowerCase()}&pageNumber=${pageNumber}`
          );
        } else if (user) {
          res = await axiosClient.get(
            `posts/?userId=${user._id}&pageNumber=${pageNumber}`
          );
        } else if (followingPin) {
          res = await axiosClient.post(
            `posts/following?pageNumber=${pageNumber}`,
            {
              author: followingPin,
            }
          );
        } else if (q) {
          res = await axiosClient.get(
            `posts/search?q=${q}&limit=${false}&pageNumber=${pageNumber}`
          );
        } else {
          res = await axiosClient.get(`posts/?pageNumber=${pageNumber}`);
        }
        setPosts((pre) => [...pre, ...res.data]);
        setHasMore(res.data.length > 0);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    getPosts();
  }, [category, user, followingPin, q, pageNumber]);

  const handleGoToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div
        className={`masonary ${followPage && "followPage"} ${
          !sidebar && "noSidebar"
        }`}
      >
        {savePin
          ? savePin.map((post, i) => (
              <Pin
                data={post}
                key={i}
                savedPin={savedPin}
                currentUser={currentUser}
              />
            ))
          : shuffledPosts &&
            shuffledPosts.map((post, i) => (
              <Pin
                refData={shuffledPosts.length === i + 1 && lastPin}
                data={post}
                key={i}
                currentUser={currentUser}
              />
            ))}
        <div className="go-up-wrapper" onClick={handleGoToTop}>
          <FontAwesomeIcon icon={faArrowUp} className="go-up-icon" />
        </div>
      </div>
      {loading && (
        <div className="loading_pin">
          <FontAwesomeIcon icon={faCircleNotch} className="loading-icon" />
        </div>
      )}
      {q && shuffledPosts && shuffledPosts.length === 0 && !loading && (
        <div className="notFound">
          <h1>OOPS!</h1>
          <img src="./images/404.png" alt="" className="notFound-img" />
          <p className="notFound-info">NO PIN FOUNDED</p>
        </div>
      )}
    </>
  );
}

export default React.memo(Masonary);
