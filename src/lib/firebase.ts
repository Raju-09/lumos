/**
 * Firebase Configuration
 * Initialize Firebase with Firestore, Auth, and Storage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC5APPZ7EOWMYTZ2UJaJUmek22glqirGT0",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lumos-team.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lumos-team",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lumos-team.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "387295451102",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:387295451102:web:8277b1f8c1db5cc4662f4f",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-1JBMCRJDHM"
};

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
