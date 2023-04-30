import "./forgetPassword.scss";
import Loading from "../../loading/Loading";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axiosClient from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import {
  setSessionResetPassword,
  setVerifyOTP,
} from "../../../redux/tempUserSlice";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userEmail } = queryString.parse(location.search);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.get(`auth/verifyOTP?code=${OTP}`);
      dispatch(setVerifyOTP(true));
      navigate(`/resetPassword?userEmail=${userEmail}`);
      setLoading(false);
    } catch (e) {
      setErr(e.response.data.err);
      setLoading(false);
    }
  };

  const reSendOTP = async () => {
    try {
      setLoading(true);
      await axiosClient.get("auth/generateOTP");
      await axiosClient.post("auth/sendGmail", {
        userEmail,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <div className="recover">
      {loading ? (
        <Loading noMsg />
      ) : (
        <div className="recover-box container">
          <Link to="/">
            <FontAwesomeIcon
              className="close-icon"
              icon={faXmark}
              onClick={() => {
                dispatch(setSessionResetPassword(false));
              }}
            />
          </Link>
          <h1 className="recover-title">Recovery</h1>
          <p className="recover-msg">Enter OTP to recover password</p>
          <form className="recover-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="OTP">
                Enter 6 digit OTP sent to your email address.
              </label>
              <input
                type="number"
                name="OTP"
                id="OTP"
                required
                placeholder="OTP"
                value={OTP}
                onChange={(e) => {
                  setOTP(e.target.value);
                }}
              />
            </div>

            {err && <span className="err">{err}</span>}
            <button className="btn-verify" type="submit">
              Verify OTP
            </button>
            <p className="resend-OTP">
              Can't get OTP? <span onClick={reSendOTP}>Resend</span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForgetPassword;
