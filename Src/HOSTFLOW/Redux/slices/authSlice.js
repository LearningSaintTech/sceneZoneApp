import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userType: null,
  userData: {
    id: null,
    name: null,
    email: null,
    phone: null,
    location: null,
    role: null,
    mobileNumber: null,
    fullName: null,
    dob: null,
    profileImageUrl: null,
  },
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log('loginUser - Action Payload:', action.payload);
      console.log('loginUser - Current State:', state);
      state.isLoggedIn = true;
      state.userType = 'user';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      console.log('loginUser - Updated State:', state);
    },
    loginHost: (state, action) => {
      console.log('loginHost - Action Payload:', action.payload);
      console.log('loginHost - Current State:', state);
      state.isLoggedIn = true;
      state.userType = 'host';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      console.log('loginHost - Updated State:', state);
    },
    loginArtist: (state, action) => {
      console.log('loginArtist - Action Payload:', action.payload);
      console.log('loginArtist - Current State:', state);
      state.isLoggedIn = true;
      state.userType = 'artist';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      console.log('loginArtist - Updated State:', state);
    },
    logout: (state) => {
      console.log('logout - Current State:', state);
      const newState = initialState;
      console.log('logout - Updated State:', newState);
      return newState;
    },
  },
});

export const { loginUser, loginHost, loginArtist, logout } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserType = (state) => state.auth.userType;
export const selectUserData = (state) => state.auth.userData;
export const selectToken = (state) => state.auth.token;
export const selectLocation = (state) => state.auth.userData.location;
export const selectFullName = (state) => state.auth.userData.fullName;
export const selectMobileNumber = (state) => state.auth.userData.mobileNumber;
export const selectRole = (state) => state.auth.userData.role;
export const selectUserId = (state) => state.auth.userData.id;
export const selectUserName = (state) => state.auth.userData.name;
export const selectUserPhone = (state) => state.auth.userData.phone;
export const selectUserRole = (state) => state.auth.userData.role;
export const selectUserEmail = (state) => state.auth.userData.email;

export default authSlice.reducer;