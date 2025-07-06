import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  appliedEvents: [], // Array of applied event IDs

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log(`[${new Date().toISOString()}] [authSlice] loginUser - Action Payload:`, action.payload);
      console.log(`[${new Date().toISOString()}] [authSlice] loginUser - Current State:`, state);
      state.isLoggedIn = true;
      state.userType = 'user';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      // Persist to AsyncStorage
      AsyncStorage.setItem('token', state.token).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save token:`, err.message)
      );
      AsyncStorage.setItem('userType', state.userType).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save userType:`, err.message)
      );
      console.log(`[${new Date().toISOString()}] [authSlice] loginUser - Updated State:`, state);
    },
    loginHost: (state, action) => {
      console.log(`[${new Date().toISOString()}] [authSlice] loginHost - Action Payload:`, action.payload);
      console.log(`[${new Date().toISOString()}] [authSlice] loginHost - Current State:`, state);
      state.isLoggedIn = true;
      state.userType = 'host';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      // Persist to AsyncStorage
      AsyncStorage.setItem('token', state.token).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save token:`, err.message)
      );
      AsyncStorage.setItem('userType', state.userType).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save userType:`, err.message)
      );
      console.log(`[${new Date().toISOString()}] [authSlice] loginHost - Updated State:`, state);
    },
    loginArtist: (state, action) => {
      console.log(`[${new Date().toISOString()}] [authSlice] loginArtist - Action Payload:`, action.payload);
      console.log(`[${new Date().toISOString()}] [authSlice] loginArtist - Current State:`, state);
      state.isLoggedIn = true;
      state.userType = 'artist';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
      // Persist to AsyncStorage
      AsyncStorage.setItem('token', state.token).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save token:`, err.message)
      );
      AsyncStorage.setItem('userType', state.userType).catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to save userType:`, err.message)
      );
      console.log(`[${new Date().toISOString()}] [authSlice] loginArtist - Updated State:`, state);
    },
    logout: (state) => {
      console.log(`[${new Date().toISOString()}] [authSlice] logout - Current State:`, state);
      // Clear AsyncStorage
      AsyncStorage.removeItem('token').catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to remove token:`, err.message)
      );
      AsyncStorage.removeItem('userType').catch(err =>
        console.error(`[${new Date().toISOString()}] [authSlice] Failed to remove userType:`, err.message)
      );
      console.log(`[${new Date().toISOString()}] [authSlice] logout - Updated State:`, initialState);
      return initialState;
    },
    addAppliedEvent: (state, action) => {
      const eventId = action.payload;
      if (!state.appliedEvents.includes(eventId)) {
        state.appliedEvents.push(eventId);
        console.log('Added applied event to Redux:', eventId);
        console.log('Total applied events:', state.appliedEvents.length);
      }
    },
    removeAppliedEvent: (state, action) => {
      const eventId = action.payload;
      state.appliedEvents = state.appliedEvents.filter(id => id !== eventId);
      console.log('Removed applied event from Redux:', eventId);
      console.log('Total applied events:', state.appliedEvents.length);
    },
    setAppliedEvents: (state, action) => {
      state.appliedEvents = action.payload;
      console.log('Set applied events in Redux:', action.payload);
    },
  },
});

export const { loginUser, loginHost, loginArtist, logout, addAppliedEvent, removeAppliedEvent, setAppliedEvents  } = authSlice.actions;

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
export const selectAppliedEvents = (state) => state.auth.appliedEvents;

export default authSlice.reducer;