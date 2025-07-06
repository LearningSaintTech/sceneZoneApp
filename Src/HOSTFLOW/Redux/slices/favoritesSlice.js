import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: {},
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const paymentId = action.payload;
      state.favorites[paymentId] = !state.favorites[paymentId];
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
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