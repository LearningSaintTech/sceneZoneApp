import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import appliedReducer from './slices/appliedSlice';

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    auth: authReducer,
    applied: appliedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
}); 