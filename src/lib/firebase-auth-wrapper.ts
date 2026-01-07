/**
 * Firebase Auth Wrapper - Ensures auth state before Firestore operations
 * This is the KEY fix for permission denied errors
 */

import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Cache for auth state
let currentUser: User | null = null;
let authInitialized = false;
let authResolve: ((user: User | null) => void) | null = null;

// Initialize auth listener once
const authPromise = new Promise<User | null>((resolve) => {
    authResolve = resolve;

    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        authInitialized = true;

        if (authResolve) {
            authResolve(user);
            authResolve = null;
        }

        console.log('[Auth] State changed:', user?.email || 'Not logged in');
    });
});

/**
 * Wait for Firebase Auth to initialize and return current user
 * MUST be called before any Firestore operation
 */
export async function waitForAuth(): Promise<User | null> {
    if (authInitialized) {
        return currentUser;
    }
    return authPromise;
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
    return currentUser !== null;
}

/**
 * Get current user synchronously (only use after waitForAuth)
 */
export function getCurrentUser(): User | null {
    return currentUser;
}

/**
 * Wrapper for Firestore operations that require auth
 * Throws error if not authenticated
 */
export async function withAuth<T>(operation: () => Promise<T>): Promise<T> {
    const user = await waitForAuth();

    if (!user) {
        throw new Error('UNAUTHENTICATED: User must be logged in to perform this operation');
    }

    try {
        return await operation();
    } catch (error: any) {
        // Convert Firebase errors to friendly messages
        if (error.code === 'permission-denied') {
            console.error('[Auth] Permission denied - user:', user.email);
            throw new Error('Permission denied. Please ensure you are logged in.');
        }
        throw error;
    }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}
