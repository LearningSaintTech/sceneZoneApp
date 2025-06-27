import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import appliedReducer from './slices/appliedSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  auth: authReducer,
  applied: appliedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
}); 