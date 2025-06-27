import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      console.log('toggleFavorite - Action Payload:', action.payload);
      console.log('toggleFavorite - Current State:', state);
      const eventId = action.payload;
      const index = state.favorites.indexOf(eventId);
      console.log('toggleFavorite - Event Index:', index);
      if (index !== -1) {
        state.favorites.splice(index, 1);
        console.log('toggleFavorite - Removed Event ID:', eventId);
      } else {
        state.favorites.push(eventId);
        console.log('toggleFavorite - Added Event ID:', eventId);
      }
      console.log('toggleFavorite - Updated State:', state);
    },
    setFavorites: (state, action) => {
      console.log('setFavorites - Action Payload:', action.payload);
      console.log('setFavorites - Current State:', state);
      state.favorites = action.payload;
      console.log('setFavorites - Updated State:', state);
    },
    setLoading: (state, action) => {
      console.log('setLoading - Action Payload:', action.payload);
      console.log('setLoading - Current State:', state);
      state.loading = action.payload;
      console.log('setLoading - Updated State:', state);
    },
    setError: (state, action) => {
      console.log('setError - Action Payload:', action.payload);
      console.log('setError - Current State:', state);
      state.error = action.payload;
      console.log('setError - Updated State:', state);
    },
  },
});

export const { toggleFavorite, setFavorites, setLoading, setError } = favoritesSlice.actions;

export const selectFavorites = (state) => state.favorites.favorites;
export const selectIsFavorite = (state, eventId) => state.favorites.favorites.includes(eventId);
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;