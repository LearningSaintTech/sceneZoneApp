import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyDIKlMk0iM27jpo23m0mGddilxZJMw7-go",
  authDomain: "scene-zone-e1517.firebaseapp.com",
  projectId: "scene-zone-e1517",
  storageBucket: "scene-zone-e1517.appspot.com",
  messagingSenderId: "967002835299",
  appId: "1:967002835299:android:995b425b77ecf7f1d2ab56"
};

console.log('Firebase config object:', firebaseConfig);

let app;
let auth;

try {
  console.log('Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully:', app.name);

  console.log('Initializing Firebase Auth with AsyncStorage persistence...');
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  console.log('Firebase auth initialized successfully:', !!auth);
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

export { auth };