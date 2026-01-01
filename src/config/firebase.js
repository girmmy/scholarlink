// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Validate that required Firebase config values are present
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key] || firebaseConfig[key] === '');

if (missingKeys.length > 0) {
  const errorMsg = `Firebase configuration error: Missing required environment variables: ${missingKeys.join(', ')}. Please set the following in your .env file:\n${missingKeys.map(key => `VITE_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1')}`).join('\n')}`;
  console.error(errorMsg);
  // Don't throw here, but log the error so the app can still load
  // Firebase will throw its own error when trying to use auth
}

// Initialize Firebase
let app;
try {
  if (missingKeys.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    // Create a dummy app to prevent crashes, but it won't work
    console.warn('Firebase not properly configured. Authentication will not work.');
    app = null;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  app = null;
}

// Initialize Analytics only if in browser and measurementId exists and app is initialized
let analytics = null;
if (typeof window !== "undefined" && firebaseConfig.measurementId && app) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}

// Only initialize auth and db if app was successfully created
// Initialize auth FIRST as it's the primary service
let auth = null;
let db = null;

if (app) {
  try {
    // Initialize auth first (primary service)
    auth = getAuth(app);
    // Set auth persistence to ensure it's the main auth method
    auth.languageCode = 'en';
    
    // Then initialize Firestore (depends on auth for security rules)
    db = getFirestore(app);
  } catch (error) {
    console.error('Error initializing Firebase services:', error);
  }
} else {
  console.warn('Firebase app not initialized. Auth and Firestore will not be available.');
}

// Initialize Google Auth Provider
let googleProvider = null;
if (app) {
  googleProvider = new GoogleAuthProvider();
  // Add scopes if needed
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  // Set custom parameters
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

// Export Firebase services for use in other components
export { app, analytics, auth, db, googleProvider };
