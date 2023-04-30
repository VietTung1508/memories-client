import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isFetching: false,
  token: null,
  rememberMe: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },

    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    loginFailure: (state) => {
      state.isFetching = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setRememberMe } =
  userSlice.actions;

export default userSlice.reducer;
