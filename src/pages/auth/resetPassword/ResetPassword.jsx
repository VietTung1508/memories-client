import "./resetPassword.scss";
import Loading from "../../loading/Loading";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  setSessionResetPassword,
  setVerifyOTP,
} from "../../../redux/tempUserSlice";
import { useDispatch } from "react-redux";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [passVisible, setPassVisible] = useState({
    password: false,
    confirmPassword: false,
  });
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userEmail } = queryString.parse(location.search);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.put("auth/resetPassword", {
        email: userEmail,
        password: credentials.password,
      });
      await axiosClient.get("auth/createResetSession");
      dispatch(setSessionResetPassword(false));
      dispatch(setVerifyOTP(false));
      navigate("/login");
      setLoading(false);
    } catch (e) {
      setErr(e.response.data.msg);
      setLoading(false);
    }
  };

  const handleVisible = () => {
    setPassVisible({ ...passVisible, password: !passVisible.password });
  };

  const handleConfirmVisible = () => {
    setPassVisible({
      ...passVisible,
      confirmPassword: !passVisible.confirmPassword,
    });
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleFocused = () => {
    setFocused(true);
  };

  return (
    <div className="reset-password">
      {loading ? (
        <Loading noMsg />
      ) : (
        <div className="reset-password-box  container">
          <Link to="/">
            <FontAwesomeIcon className="close-icon" icon={faXmark} />
          </Link>
          <h1 className="reset-password-title">Reset Password</h1>
          <p className="reset-password-msg">Enter your new password.</p>
          <form className="reset-password-form" onSubmit={handleSubmit}>
            <div>
              {" "}
              <label htmlFor="password">Password</label>
              <div className="passwordInner">
                <input
                  type={passVisible.password ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  placeholder="Your Password"
                  value={credentials.password}
                  onChange={handleChange}
                  focused={focused.toString()}
                />
                <FontAwesomeIcon
                  className="password-visible"
                  icon={passVisible ? faEyeSlash : faEye}
                  onClick={handleVisible}
                  name="password"
                />
                <span>Min of 8 characters, at least 1 letter,1 number</span>
              </div>
            </div>
            <div>
              {" "}
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="passwordInner">
                <input
                  type={passVisible.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  placeholder="Confirm Password"
                  pattern={credentials.password}
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocused}
                  focused={focused.toString()}
                />
                <FontAwesomeIcon
                  className="password-visible"
                  icon={passVisible ? faEyeSlash : faEye}
                  name="confirmPassword"
                  onClick={handleConfirmVisible}
                />
                <span>Password not match</span>
              </div>
            </div>
            {err && <span className="err">{err}</span>}
            <button className="btn-reset" type="submit">
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
