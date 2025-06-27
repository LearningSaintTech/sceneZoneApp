// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isLoggedIn: false,
//   userType: null, // 'user', 'host', 'artist'
//   userData: {
//     id: null,
//     name: null,
//     email: null,
//     phone: null,
//     location: null,
//     role: null,
//     mobileNumber: null,
//     fullName: null
//   },
//   token: null,
// };

// const authSlice = createSlice({                                                   
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginUser: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'user';
//       state.userData = {
//         ...state.userData,
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     loginHost: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'host';
//       state.userData = {
//         ...state.userData,632
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     loginArtist: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'artist';
//       state.userData = {
//         ...state.userData,
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     logout: (state) => {
//       return initialState;
//     },
//   },
// });

// export const { loginUser, loginHost, loginArtist, logout } = authSlice.actions;

// // Selectors
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectUserType = (state) => state.auth.userType;
// export const selectUserData = (state) => state.auth.userData;
// export const selectToken = (state) => state.auth.token;
// export const selectLocation = (state) => state.auth.userData.location;
// export const selectFullName = (state) => state.auth.userData.fullName;
// export const selectMobileNumber = (state) => state.auth.userData.mobileNumber;
// export const selectRole = (state) => state.auth.userData.role;

// export default authSlice.reducer; 





//  code by  anirudh


  
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   isLoggedIn: false,
//   userType: null, // 'user', 'host', 'artist'
//   userData: {
//     id: null,
//     name: null,
//     email: null,
//     phone: null,
//     location: null,
//     role: null,
//     mobileNumber: null,
//     fullName: null
//   },
//   token: null,
// };

// const authSlice = createSlice({                                                   
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginUser: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'user';
//       state.userData = {
//         ...state.userData,
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     loginHost: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'host';
//       state.userData = {
//         ...state.userData,
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     loginArtist: (state, action) => {
//       state.isLoggedIn = true;
//       state.userType = 'artist';
//       state.userData = {
//         ...state.userData,
//         ...action.payload
//       };
//       state.token = action.payload.token || null;
//     },
//     logout: (state) => {
//       return initialState;
//     },
//   },
// });

// export const { loginUser, loginHost, loginArtist, logout } = authSlice.actions;

// // Selectors
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectUserType = (state) => state.auth.userType;
// export const selectUserData = (state) => state.auth.userData;
// export const selectToken = (state) => state.auth.token;
// export const selectLocation = (state) => state.auth.userData.location;
// export const selectFullName = (state) => state.auth.userData.fullName;
// export const selectMobileNumber = (state) => state.auth.userData.mobileNumber;
// export const selectRole = (state) => state.auth.userData.role;

// export default authSlice.reducer; 








import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userType: null, // 'user', 'host', 'artist'
  
  
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
      state.isLoggedIn = true;
      state.userType = 'user';
      state.userData = {
        ...state.userData,
        ...action.payload, // Spread payload to update userData fields
      };
      state.token = action.payload.token || null;
    },
    loginHost: (state, action) => {
      state.isLoggedIn = true;
      state.userType = 'host';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
    },
    loginArtist: (state, action) => {
      state.isLoggedIn = true;
      state.userType = 'artist';
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
      state.token = action.payload.token || null;
    },
    logout: (state) => {
      return initialState;
    },
  },
});

export const { loginUser, loginHost, loginArtist, logout } = authSlice.actions;

// Selectors
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