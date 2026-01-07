/**
 * Analytics and Statistics Types
 */

export interface PlacementStats {
    batchYear: number;

    // Overall Metrics
    totalStudents: number;
    eligibleStudents: number;
    placedStudents: number;
    placementRate: number; // Percentage

    // Package Data
    averagePackage: number; // In LPA
    medianPackage: number;
    highestPackage: number;
    lowestPackage: number;

    // Department Breakdown
    departmentStats: DepartmentStats[];

    // Company Stats
    companyStats: CompanyStats[];

    // CTC Distribution
    ctcDistribution: CTCBracket[];

    // Monthly Trends
    monthlyPlacements: MonthlyData[];

    // Gender Statistics
    genderStats: GenderStats;

    // Job Type Distribution
    jobTypeDistribution: JobTypeStats[];

    // Updated timestamp
    lastUpdated: Date;
}

export interface DepartmentStats {
    department: string;
    totalStudents: number;
    eligibleStudents: number;
    placedStudents: number;
    placementRate: number;
    averagePackage: number;
    highestPackage: number;
    lowestPackage: number;
    topCompanies: string[];
}

export interface CompanyStats {
    companyId: string;
    companyName: string;
    companyLogo?: string;
    industry: string;
    offersGiven: number;
    studentsHired: number;
    averagePackage: number;
    highestPackage: number;
    jobTypes: string[]; // Full-Time, Internship, etc.
    branches: string[]; // Which branches got offers
}

export interface CTCBracket {
    range: string; // "0-5 LPA", "5-10 LPA"
    min: number;
    max: number;
    count: number;
    percentage: number;
    students?: { name: string; branch: string; package: number }[];
}

export interface MonthlyData {
    month: string; // "Sep 2025", "Oct 2025"
    monthNumber: number; // 1-12
    year: number;
    placementCount: number;
    cumulativePlacements: number;
    averagePackage: number;
    topCompany?: string;
}

export interface GenderStats {
    male: {
        total: number;
        placed: number;
        placementRate: number;
        averagePackage: number;
    };
    female: {
        total: number;
        placed: number;
        placementRate: number;
        averagePackage: number;
    };
    other: {
        total: number;
        placed: number;
        placementRate: number;
        averagePackage: number;
    };
}

export interface JobTypeStats {
    jobType: string; // "Full-Time", "Internship"
    count: number;
    percentage: number;
    averagePackage: number;
}

// Real-time Dashboard Metrics
export interface DashboardMetrics {
    // Current Stats
    activeDrives: number;
    totalApplications: number;
    pendingReviews: number;
    offersGiven: number;

    // Trends (vs previous period)
    applicationsTrend: number; // +15% or -10%
    offersTrend: number;
    packageTrend: number;

    // Recent Activity
    recentApplications: RecentActivity[];
    recentOffers: RecentActivity[];
    upcomingEvents: UpcomingEvent[];
}

export interface RecentActivity {
    id: string;
    studentName: string;
    companyName: string;
    action: string; // "Applied", "Shortlisted", "Offered"
    timestamp: Date;
}

export interface UpcomingEvent {
    id: string;
    type: 'Test' | 'Interview' | 'Pre-Placement Talk' | 'Deadline';
    title: string;
    companyName?: string;
    date: Date;
    studentsAffected: number;
}

// AI-Generated Insights
export interface AIInsight {
    id: string;
    type: 'Success' | 'Warning' | 'Info' | 'Recommendation';
    title: string;
    description: string;
    data?: any;
    impact: 'High' | 'Medium' | 'Low';
    actionable: boolean;
    actionText?: string;
    generatedAt: Date;
}

// Skill Gap Analysis
export interface SkillGapAnalysis {
    topDemandedSkills: SkillDemand[];
    studentSkillCoverage: SkillCoverage[];
    recommendations: SkillRecommendation[];
}

export interface SkillDemand {
    skill: string;
    demandCount: number; // How many drives require this
    averagePackage: number; // Avg package for roles requiring this skill
    trend: 'Rising' | 'Stable' | 'Declining';
}

export interface SkillCoverage {
    skill: string;
    requiredByDrives: number;
    studentsWithSkill: number;
    coveragePercentage: number;
    gap: number;
}

export interface SkillRecommendation {
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    reason: string;
    estimatedImpact: string; // "Could make X more students eligible"
    resources?: string[]; // Learning resource links
}
