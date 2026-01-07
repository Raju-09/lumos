/**
 * Drive (Job Opportunity) and Related Types
 */

export interface Drive {
    id: string;

    // Company Details
    companyId: string;
    companyName: string;
    companyLogo?: string;
    industry: string;
    companyWebsite?: string;

    // Role Details
    role: string;
    jobType: JobType;
    jobDescription: string;
    jdFileUrl?: string;
    keyResponsibilities?: string[];
    skillsRequired?: string[];

    // Package & Compensation
    ctcMin: number; // In LPA
    ctcMax: number; // In LPA
    stipend?: number; // For internships (monthly)
    bondDuration?: number; // In months
    otherBenefits?: string[];

    // Location & Work Mode
    locations: string[];
    workMode: WorkMode;

    // Eligibility Criteria
    eligibilityCriteria: EligibilityRule[];
    estimatedEligibleCount?: number;

    // Rounds & Process
    rounds: InterviewRound[];

    // Application Settings
    applicationDeadline: Date;
    maxApplications?: number;
    autoNotifyEligible: boolean;
    allowPartiallyEligible: boolean; // Can apply even if 1-2 criteria missed

    // Status & Stats
    status: DriveStatus;
    totalApplications: number;
    shortlistedCount: number;
    placedCount: number;

    // Metadata
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

export type JobType =
    | 'Full-Time'
    | 'Internship'
    | 'PPO'
    | '6-Month Internship'
    | 'Intern + PPO';

export type WorkMode =
    | 'On-site'
    | 'Remote'
    | 'Hybrid';

export type DriveStatus =
    | 'Draft'
    | 'Open'
    | 'Closed'
    | 'Completed'
    | 'Cancelled';

export interface EligibilityRule {
    id: string;
    field: EligibilityField;
    operator: EligibilityOperator;
    value: any;
    description?: string; // Human-readable description
}

export type EligibilityField =
    | 'cgpa'
    | 'activeBacklogs'
    | 'branch'
    | 'batch'
    | 'gender'
    | 'tenthPercentage'
    | 'twelfthPercentage'
    | 'skills'
    | 'hasInternship';

export type EligibilityOperator =
    | '>'
    | '<'
    | '='
    | '>='
    | '<='
    | '!='
    | 'IN'
    | 'NOT IN'
    | 'CONTAINS'
    | 'NOT CONTAINS';

export interface InterviewRound {
    id: string;
    roundNumber: number;
    roundName: string; // "Online Assessment", "Technical Interview", etc.
    roundType: RoundType;
    date?: Date;
    endDate?: Date; // For multi-day rounds
    duration?: number; // In minutes
    platform?: string; // "HackerRank", "Zoom", "Google Meet"
    mode: 'Online' | 'Offline';
    location?: string; // If offline
    instructions?: string;
    meetingLink?: string;
}

export type RoundType =
    | 'Online Test'
    | 'Technical Interview'
    | 'HR Interview'
    | 'Group Discussion'
    | 'Case Study'
    | 'Aptitude Test'
    | 'Coding Assessment';

// Company Master Data
export interface Company {
    id: string;
    name: string;
    logo?: string;
    industry: string;
    website?: string;
    description?: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    linkedinUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

// For drive creation/update forms
export interface DriveFormData extends Omit<Drive, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'totalApplications' | 'shortlistedCount' | 'placedCount'> { }
