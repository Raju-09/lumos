/**
 * Enhanced Application Types with Complete History and Stage Tracking
 */

export interface ApplicationStage {
    stage: 'Applied' | 'Shortlisted' | 'Aptitude Test' | 'Technical Round 1' | 'Technical Round 2' | 'HR Round' | 'Final Interview' | 'Offer' | 'Rejected';
    status: 'pending' | 'cleared' | 'rejected';
    date: Date;
    feedback?: string;
    feedbackTags?: ('Skills Mismatch' | 'Communication Gap' | 'Technical Gap' | 'Culture Fit' | 'Other')[];
}

export interface PlacementHistoryEntry {
    id: string;
    studentId: string;
    driveId: string;
    companyName: string;
    role: string;
    ctc: string;
    appliedDate: Date;
    stages: ApplicationStage[];
    currentStage: string;
    finalOutcome: 'Selected' | 'Rejected' | 'Withdrawn' | 'In Progress';
    offerLetter?: string;
    isPlaced: boolean;
}

export interface RecruiterFeedback {
    driveId: string;
    companyName: string;
    totalApplicants: number;
    shortlisted: number;
    selected: number;
    commonTags: {
        tag: string;
        count: number;
        percentage: number;
    }[];
    averagePerformance: {
        technical: number;
        communication: number;
        overall: number;
    };
}

export interface GoogleSheetsSync {
    lastImport?: Date;
    lastExport?: Date;
    studentsImported: number;
    placementsExported: number;
    status: 'synced' | 'pending' | 'error';
}
