import { createSlice } from '@reduxjs/toolkit';

export const authReducer = createSlice({
  name: 'auth',
  initialState: {
    key: 0,
    isLoginClient: false,
    expiredToken: false,
    userClient: {},
    loginFirst: false,
    // Admin
    isLoginAdmin: false,
    userAdmin: {},
  },
  reducers: {
    setKey: (state, action) => {
      state.key = action.payload;
    },
    // Client
    setUserClient: (state, action) => {
      state.userClient = action.payload;
    },
    setIsLoginClient: (state, action) => {
      state.isLoginClient = action.payload;
    },
    setLoginFirst: (state, action) => {
      state.loginFirst = action.payload;
    },
    // Admin
    setUserAdmin: (state, action) => {
      state.userAdmin = action.payload;
    },
    setIsLoginAdmin: (state, action) => {
      state.isLoginAdmin = action.payload;
    },
  },
});

export const { setUserClient, setIsLoginClient, setLoginFirst, setUserAdmin, setIsLoginAdmin } = authReducer.actions;

export default authReducer.reducer;
