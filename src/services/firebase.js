// src/services/firebase.js
// Firebase Authentication Service for AAGAM Portal
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBver8hGGWlfGKTpixC7hMw8zHVNePM1go",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aagam-16f20.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aagam-16f20",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aagam-16f20.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "409592571151",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:409592571151:web:2f493b157a55797fef8a7a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9FW9F63TH1"
};

// Initialize Firebase (singleton check)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Maps a Firebase User credential to an AAGAM persona profile
 */
export const mapFirebaseUserToAagamProfile = (user, selectedRole = 'Farmer') => {
  if (!user) return null;
  return {
    name: user.displayName || user.email?.split('@')[0] || 'AAGAM Verified User',
    role: selectedRole || 'Farmer',
    id: `FB-${user.uid.slice(0, 10).toUpperCase()}`,
    uid: user.uid,
    email: user.email || `${user.uid.slice(0, 8)}@aagam.gov.in`,
    mobile: user.phoneNumber || '+91 98765 43210',
    photoURL: user.photoURL || null,
    mandi: 'Karnal Central Yard (HR)',
    state: 'Haryana',
    authMethod: 'Firebase Auth',
    token: `FB-TOKEN-${user.uid.slice(0, 12)}`,
    emailVerified: user.emailVerified
  };
};

/**
 * Sign in with Google Popup
 */
export const signInWithGoogle = async (selectedRole = 'Farmer') => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const userProfile = mapFirebaseUserToAagamProfile(result.user, selectedRole);
    return { success: true, user: userProfile, firebaseUser: result.user };
  } catch (error) {
    console.error('Firebase Google Sign-In Error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Sign in with Email and Password
 */
export const signInWithEmail = async (email, password, selectedRole = 'Farmer') => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const userProfile = mapFirebaseUserToAagamProfile(result.user, selectedRole);
    return { success: true, user: userProfile, firebaseUser: result.user };
  } catch (error) {
    console.error('Firebase Email Sign-In Error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Register with Email and Password
 */
export const registerWithEmail = async (email, password, displayName, selectedRole = 'Farmer') => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    const userProfile = mapFirebaseUserToAagamProfile({ ...result.user, displayName }, selectedRole);
    return { success: true, user: userProfile, firebaseUser: result.user };
  } catch (error) {
    console.error('Firebase Registration Error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Setup Recaptcha for Phone Auth
 */
export const setupPhoneRecaptcha = (containerId) => {
  if (typeof window === 'undefined') return null;
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      }
    });
  }
  return window.recaptchaVerifier;
};

/**
 * Send Phone Auth SMS OTP via Firebase
 */
export const sendFirebasePhoneOtp = async (phoneNumber, recaptchaVerifier) => {
  try {
    // Format to E.164: e.g. +919876543210
    let formattedNumber = phoneNumber.trim();
    if (!formattedNumber.startsWith('+')) {
      const cleanDigits = formattedNumber.replace(/[^0-9]/g, '').slice(-10);
      formattedNumber = `+91${cleanDigits}`;
    }
    const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    return { success: true, confirmationResult };
  } catch (error) {
    console.error('Firebase Phone Auth Error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Send Password Reset Email
 */
export const resetUserPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Firebase Password Reset Error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

/**
 * Sign out from Firebase
 */
export const signOutFirebaseUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Subscribe to Firebase Auth state changes
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;
