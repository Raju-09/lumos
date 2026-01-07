/**
 * Application and Status Tracking Types
 */

export interface Application {
    id: string;
    studentId: string;
    driveId: string;

    // Core Data
    studentName: string;
    studentEmail: string;
    studentBranch: string;
    studentCGPA: number;
    companyName: string;
    role: string;

    // Status Tracking
    status: ApplicationStatus;
    currentRound: number;
    statusHistory: StatusChange[];

    // Round-wise Feedback
    feedback: RoundFeedback[];

    // Optional Fields
    resumeUrl?: string;
    coverLetter?: string;
    notes?: string;

    // Timestamps
    appliedAt: Date;
    updatedAt: Date;
    lastStatusChangeAt: Date;
}

export type ApplicationStatus =
    | 'Applied'
    | 'Under Review'
    | 'Shortlisted'
    | 'Test Scheduled'
    | 'Test Completed'
    | 'Interview Scheduled'
    | 'Interview Completed'
    | 'Offer Extended'
    | 'Offer Accepted'
    | 'Offer Declined'
    | 'Rejected'
    | 'Withdrawn'
    | 'On Hold';

export interface StatusChange {
    id: string;
    from: ApplicationStatus;
    to: ApplicationStatus;
    changedBy: string; // User ID
    changedByName: string;
    changedAt: Date;
    notes?: string;
    automated: boolean; // Was this an automated change?
}

export interface RoundFeedback {
    id: string;
    roundId: string;
    roundName: string;
    roundType: string;

    // Feedback Data
    interviewer?: string;
    interviewerEmail?: string;
    rating?: number; // 1-5 stars
    comments?: string;
    strengths?: string[];
    improvements?: string[];
    technicalScore?: number; // Out of 100
    communicationScore?: number;
    recommendation?: 'Strong Hire' | 'Hire' | 'Maybe' | 'No Hire';

    // Status
    passed: boolean;

    // Metadata
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// Application with populated data
export interface ApplicationWithDetails extends Application {
    student: {
        id: string;
        name: string;
        email: string;
        phone: string;
        profilePhoto?: string;
        branch: string;
        cgpa: number;
        skills: string[];
    };
    drive: {
        id: string;
        companyName: string;
        role: string;
        jobType: string;
        package: string;
    };
}

// For filtering applications
export interface ApplicationFilters {
    status?: ApplicationStatus[];
    driveId?: string;
    studentId?: string;
    branch?: string[];
    cgpaMin?: number;
    cgpaMax?: number;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string; // Search by student name or company
}

// Application statistics
export interface ApplicationStats {
    total: number;
    applied: number;
    underReview: number;
    shortlisted: number;
    testScheduled: number;
    interviewScheduled: number;
    offered: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
}
