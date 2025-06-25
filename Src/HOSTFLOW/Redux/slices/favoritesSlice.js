<<<<<<< HEAD
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   favorites: {},
//   loading: false,
//   error: null
// };

// const favoritesSlice = createSlice({
//   name: 'favorites',
//   initialState,
//   reducers: {
//     toggleFavorite: (state, action) => {
//       const paymentId = action.payload;
//       state.favorites[paymentId] = !state.favorites[paymentId];
//     },
//     setFavorites: (state, action) => {
//       state.favorites = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.loading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     }
//   }
// });

// export const { toggleFavorite, setFavorites, setLoading, setError } = favoritesSlice.actions;

// // Selectors
// export const selectFavorites = (state) => state.favorites.favorites;
// export const selectIsFavorite = (state, paymentId) => state.favorites.favorites[paymentId] || false;
// export const selectFavoritesLoading = (state) => state.favorites.loading;
// export const selectFavoritesError = (state) => state.favorites.error;

// export default favoritesSlice.reducer; 



import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [], // ✅ Now it's an array
  loading: false,
  error: null,
=======
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: {},
  loading: false,
  error: null
>>>>>>> 6420727b7d1343cd37d1c1cfbbbdf7a59805d6e9
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
<<<<<<< HEAD
      const eventId = action.payload;
      const index = state.favorites.indexOf(eventId);
      if (index !== -1) {
        state.favorites.splice(index, 1); // remove
      } else {
        state.favorites.push(eventId); // add
      }
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload; // should be an array
=======
      const paymentId = action.payload;
      state.favorites[paymentId] = !state.favorites[paymentId];
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
>>>>>>> 6420727b7d1343cd37d1c1cfbbbdf7a59805d6e9
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
<<<<<<< HEAD
    },
  },
});

export const { toggleFavorite, setFavorites, setLoading, setError } =
  favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, eventId) =>
  state.favorites.favorites.includes(eventId);
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;
=======
    }
  }
});

export const { toggleFavorite, setFavorites, setLoading, setError } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, paymentId) => state.favorites.favorites[paymentId] || false;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer; 
>>>>>>> 6420727b7d1343cd37d1c1cfbbbdf7a59805d6e9
