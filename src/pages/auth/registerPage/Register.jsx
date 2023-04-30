import "./register.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import axiosClient from "../../../api/axiosClient";
import { useNavigate } from "react-router-dom";

function Register() {
  const [credentials, setCredentials] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passVisible, setPassVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFocused = () => {
    setFocused(true);
  };

  const handleVisible = () => {
    setPassVisible(!passVisible);
  };
  const handleVisibleConfirm = () => {
    setConfirmPassVisible(!confirmPassVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { confirmPassword, ...others } = credentials;
    try {
      await axiosClient.post("auth/register", others);
      navigate("/login");
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  const changeCredentials = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="register">
      <div className="register__box  container">
        <Link to="/">
          <FontAwesomeIcon className="close-icon" icon={faXmark} />
        </Link>
        <div className="register__box__left">
          <img src="./images/register.jpg" alt="" />
        </div>
        <div className="register__box__right">
          <h1>Register</h1>
          <p className="ads">
            Need Inspiration ? <br />
            Sign up now in order to explore and connect with thousands of our
            users
          </p>
          <p className="register-link">
            Already have an account?{" "}
            <Link to="/login">
              <span> Log in.</span>
            </Link>
          </p>
          <form className="register-form" onSubmit={handleSubmit}>
            <div>
              {" "}
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                required
                pattern="^[A-Za-z0-9]{3,16}$"
                placeholder="First Name"
                value={credentials.firstname}
                onChange={changeCredentials}
                focused={focused.toString()}
              />
              <span>Minimum of 3 characters.</span>
            </div>
            <div>
              {" "}
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                required
                pattern="^[A-Za-z0-9]{3,16}$"
                placeholder="Last Name"
                value={credentials.lastname}
                onChange={changeCredentials}
                focused={focused.toString()}
              />
              <span>Minimum of 3 characters.</span>
            </div>
            <div>
              {" "}
              <label htmlFor="username">User Name</label>
              <input
                type="text"
                name="username"
                id="username"
                required
                pattern="^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$"
                placeholder="Username"
                value={credentials.username}
                onChange={changeCredentials}
                focused={focused.toString()}
              />
              <span>Minumum of 5 characters.</span>
            </div>
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
                onChange={changeCredentials}
                focused={focused.toString()}
              />
              <span>Email is not valid </span>
            </div>
            <div>
              {" "}
              <label htmlFor="password">Password</label>
              <div className="passwordInner">
                <input
                  type={passVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  placeholder="Password"
                  pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                  value={credentials.password}
                  onChange={changeCredentials}
                  focused={focused.toString()}
                />
                <FontAwesomeIcon
                  className="password-visible"
                  icon={passVisible ? faEyeSlash : faEye}
                  onClick={handleVisible}
                />
                <span className={`passErr`}>
                  Min of 8 characters, at least 1 letter,1 number
                </span>
              </div>
            </div>
            <div>
              {" "}
              <label htmlFor="confirm">Confirm Password</label>
              <div className="passwordInner">
                <input
                  type={confirmPassVisible ? "text" : "password"}
                  id="confirm"
                  name="confirmPassword"
                  required
                  placeholder="Confirm Password"
                  value={credentials.confirmPassword}
                  onChange={changeCredentials}
                  pattern={credentials.password}
                  onFocus={handleFocused}
                  focused={focused.toString()}
                />
                <FontAwesomeIcon
                  className="password-visible"
                  icon={confirmPassVisible ? faEyeSlash : faEye}
                  onClick={handleVisibleConfirm}
                />
                <span>Password not match</span>
              </div>
            </div>

            <div className="submit">
              {error && <span className="err">{error}</span>}
              <button className="btn-register" type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
