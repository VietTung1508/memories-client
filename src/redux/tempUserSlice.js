import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isFetching: false,
  token: null,
  sessionResetPassword: false,
  verifyOTP: false,
};

const tempUserSlice = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    tempLoginStart: (state) => {
      state.isFetching = true;
    },

    tempLoginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    tempLoginFailure: (state) => {
      state.isFetching = false;
    },

    tempLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setSessionResetPassword: (state, action) => {
      state.sessionResetPassword = action.payload;
    },
    setVerifyOTP: (state, action) => {
      state.verifyOTP = action.payload;
    },
  },
});

export const {
  tempLoginStart,
  tempLoginSuccess,
  tempLoginFailure,
  tempLogout,
  setSessionResetPassword,
  setVerifyOTP,
} = tempUserSlice.actions;

export default tempUserSlice.reducer;
