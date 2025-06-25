import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './slices/favoritesSlice';
import authReducer from './slices/authSlice';
<<<<<<< HEAD
=======
import appliedReducer from './slices/appliedSlice';
>>>>>>> 6420727b7d1343cd37d1c1cfbbbdf7a59805d6e9

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    auth: authReducer,
<<<<<<< HEAD
=======
    applied: appliedReducer,
>>>>>>> 6420727b7d1343cd37d1c1cfbbbdf7a59805d6e9
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
}); 