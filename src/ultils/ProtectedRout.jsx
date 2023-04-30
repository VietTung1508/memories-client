import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
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

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const IsAuth = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const IsResetPassword = ({ children }) => {
  const resetPassword = useSelector(
    (state) => state.tempUser.sessionResetPassword
  );

  if (!resetPassword) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const IsVerifyOTP = ({ children }) => {
  const verifyOTP = useSelector((state) => state.tempUser.verifyOTP);

  if (!verifyOTP) {
    return <Navigate to="/recoverPassword" replace />;
  }

  return children;
};
