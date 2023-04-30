import "./login.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../../redux/userSlice";
import {
  tempLoginStart,
  tempLoginSuccess,
  tempLoginFailure,
  setSessionResetPassword,
} from "../../../redux/tempUserSlice";
import { setRememberMe } from "../../../redux/userSlice";
import axiosClient from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import Loading from "../../loading/Loading";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState(null);
  const [passVisible, setPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVisible = () => {
    setPassVisible(!passVisible);
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (remember) {
      dispatch(setRememberMe(true));
      dispatch(loginStart());
      try {
        const res = await axiosClient.post("auth/login", credentials);
        dispatch(loginSuccess({ user: res.data, token: res.data.accessToken }));
        navigate("/");
      } catch (e) {
        setErr(e.response.data.message);
        dispatch(loginFailure());
      }
    } else {
      dispatch(setRememberMe(false));
      dispatch(tempLoginStart());
      try {
        const res = await axiosClient.post("auth/login", credentials);
        dispatch(
          tempLoginSuccess({ user: res.data, token: res.data.accessToken })
        );
        navigate("/");
      } catch (e) {
        setErr(e.response.data.message);
        dispatch(tempLoginFailure());
      }
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRecoverPassword = async () => {
    if (
      validateEmail(credentials.email) &&
      credentials.email.length > 0 &&
      credentials.email !== " "
    ) {
      try {
        setLoading(true);
        await axiosClient.get("auth/generateOTP");
        await axiosClient.post("auth/sendGmail", {
          userEmail: credentials.email,
        });
        dispatch(setSessionResetPassword(true));
        navigate(`/recoverPassword?userEmail=${credentials.email}`);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    } else {
      setErr("You need valid email to recover your password.");
    }
  };

  return (
    <div className="login">
      {loading ? (
        <Loading noMsg />
      ) : (
        <div className="login__box  container">
          <Link to="/">
            <FontAwesomeIcon className="close-icon" icon={faXmark} />
          </Link>
          <div className="login__box__left">
            <img src="./images/login.jpg" alt="" />
          </div>
          <div className="login__box__right">
            <h1>Login</h1>
            <p className="login-link">
              Doesn't have an account yet ?{" "}
              <Link to="/register">
                <span>Sign up</span>
              </Link>
            </p>
            <form className="login-form" onSubmit={handleSubmit}>
              <div>
                {" "}
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="you@expample.com"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                {" "}
                <label htmlFor="password">Password</label>
                <input
                  type={passVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  placeholder="Enter 6 character or more"
                  value={credentials.password}
                  onChange={handleChange}
                />
                <FontAwesomeIcon
                  className="password-visible"
                  icon={passVisible ? faEyeSlash : faEye}
                  onClick={handleVisible}
                />
                <h5 className="forgetPassword" onClick={handleRecoverPassword}>
                  Forgot Password ?
                </h5>
              </div>
              {err && <span className="err">{err}</span>}
              <div className="rememberMe-wrapper">
                <input
                  type="checkbox"
                  id="rememberMe"
                  onChange={() => {
                    setRemember(!remember);
                  }}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <button className="btn-login" type="submit">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
