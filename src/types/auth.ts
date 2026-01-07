export type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface StudentProfile extends User {
    role: 'STUDENT';
    batch: string; // e.g., "2026"
    department: string; // e.g., "Computer Science"
    cgpa: number;
    backlogs: number;
    skills: string[];
    resumeUrl?: string;
}

export interface AdminProfile extends User {
    role: 'ADMIN';
    designation?: string; // e.g., "Placement Officer"
}

export interface AuthState {
    user: User | StudentProfile | AdminProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
