import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
import appliedReducer from './slices/appliedSlice';
import notificationReducer from './slices/notificationSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Persist only the auth slice
};

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  auth: authReducer,
  applied: appliedReducer,
  notifications: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    console.log(`[${new Date().toISOString()}] [store] Configuring store with middleware`);
    const middleware = getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    });
    console.log(`[${new Date().toISOString()}] [store] Store configured with middleware:`, middleware);
    return middleware;
  },
});

export const persistor = persistStore(store);

console.log(`[${new Date().toISOString()}] [store] Store initialized:`, store.getState());