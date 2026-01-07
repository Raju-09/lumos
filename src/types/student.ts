/**
 * Student Profile and Related Types
 */

export interface StudentProfile {
    id: string;
    userId: string;

    // Basic Info
    name: string;
    email: string;
    phone: string;
    profilePhoto?: string;

    // Academic Details
    rollNumber: string;
    branch: Department;
    batch: number; // 2026, 2027, etc.
    currentCGPA: number;
    activeBacklogs: number;
    tenthPercentage: number;
    twelfthPercentage: number;

    // Skills & Competencies
    programmingLanguages: string[];
    frameworks: string[];
    tools: string[];
    softSkills: string[];

    // Experience
    internships: Internship[];
    projects: Project[];
    certifications: Certification[];

    // Documents
    resumeUrl?: string;
    portfolioUrl?: string;

    // Metadata
    profileCompleteness: number; // 0-100
    createdAt: Date;
    updatedAt: Date;
}

export type Department =
    | 'CSE'
    | 'IT'
    | 'ECE'
    | 'EEE'
    | 'MECH'
    | 'CIVIL'
    | 'CHEM'
    | 'BT'
    | 'AI_ML'
    | 'DS'
    | 'Other';

export interface Internship {
    id: string;
    company: string;
    role: string;
    duration: string; // "3 months"
    description: string;
    technologies?: string[];
    startDate: Date;
    endDate?: Date;
    current: boolean;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    startDate: Date;
    endDate?: Date;
    highlights?: string[]; // Key achievements
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialUrl?: string;
    credentialId?: string;
}

// For profile creation/update forms
export interface StudentProfileFormData extends Omit<StudentProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'profileCompleteness'> { }
