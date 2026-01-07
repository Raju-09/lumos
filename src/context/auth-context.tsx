/**
 * Enhanced Auth Context with Role-Based Access Control
 * Fixed to work with RoleGuard and uppercase roles
 */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Uppercase roles to match RoleGuard expectations
export type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export interface User {
    uid?: string;
    email?: string;
    rollNumber?: string;
    role: UserRole;
    name: string;
    academicYear?: number;
    loginTime?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean; // Added for RoleGuard
    hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as loading
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        try {
            const stored = localStorage.getItem('lumos_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure role is uppercase
                if (parsed.role) {
                    parsed.role = parsed.role.toUpperCase();
                }
                setUser(parsed);
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setIsLoading(false); // Done loading
        }
    }, []);

    const login = (userData: User) => {
        // Ensure role is uppercase before storing
        const normalizedUser = {
            ...userData,
            role: userData.role?.toUpperCase() as UserRole
        };
        setUser(normalizedUser);
        localStorage.setItem('lumos_user', JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lumos_user');
        router.push('/login');
    };

    const hasRole = (role: UserRole) => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isLoading,
                hasRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
