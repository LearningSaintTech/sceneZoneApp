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
  middleware: (getDefaultMiddleware) => {
    console.log('Configuring store with middleware');
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    });
    console.log('Store configured with middleware:', middleware);
    return middleware;
  },
});

console.log('Store initialized:', store.getState());