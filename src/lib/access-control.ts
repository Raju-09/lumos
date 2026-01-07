/**
 * Year-Based Access Control
 * Implements policy-based feature access for students based on academic year
 */

export interface AccessLevel {
    canViewPlacements: boolean;
    canApplyPlacements: boolean;
    canViewSalaries: boolean;
    canViewFullEligibility: boolean;
    canAccessAdvancedResume: boolean;
    canAccessATSForPlacements: boolean;
    dashboardMessage: string;
}

/**
 * Get access level based on student's academic year
 */
export function getAccessLevel(year: 1 | 2 | 3 | 4): AccessLevel {
    switch (year) {
        case 1:
        case 2:
            return {
                canViewPlacements: false,
                canApplyPlacements: false,
                canViewSalaries: false,
                canViewFullEligibility: false,
                canAccessAdvancedResume: false,
                canAccessATSForPlacements: false,
                dashboardMessage: `Focus on building skills and exploring internships. Placement drives will be available in your ${year === 1 ? '3rd' : 'final'} year.`
            };

        case 3:
            return {
                canViewPlacements: true,
                canApplyPlacements: true,
                canViewSalaries: true, // Preview mode
                canViewFullEligibility: true,
                canAccessAdvancedResume: true,
                canAccessATSForPlacements: true,
                dashboardMessage: 'You can now view and apply to select placement drives. Focus on building a strong profile!'
            };

        case 4:
            return {
                canViewPlacements: true,
                canApplyPlacements: true,
                canViewSalaries: true,
                canViewFullEligibility: true,
                canAccessAdvancedResume: true,
                canAccessATSForPlacements: true,
                dashboardMessage: 'Full access to all placement opportunities. Make the most of your final year!'
            };
    }
}

/**
 * Filter drives based on student's year eligibility
 */
export function filterDrivesByYear<T extends { eligibleYears?: number[] }>(
    drives: T[],
    studentYear: number
): T[] {
    return drives.filter(drive => {
        if (!drive.eligibleYears || drive.eligibleYears.length === 0) {
            // If no eligibleYears specified, assume all years
            return true;
        }
        return drive.eligibleYears.includes(studentYear);
    });
}

/**
 * Check if student can view a specific drive
 */
export function canViewDrive(drive: { type: string; eligibleYears?: number[] }, studentYear: number): boolean {
    const access = getAccessLevel(studentYear as 1 | 2 | 3 | 4);

    // Internships are visible to all years
    if (drive.type === 'Internship') {
        return true;
    }

    // Placements only visible to 3rd and 4th year
    if (!access.canViewPlacements) {
        return false;
    }

    // Check year eligibility
    if (drive.eligibleYears && drive.eligibleYears.length > 0) {
        return drive.eligibleYears.includes(studentYear);
    }

    return true;
}

/**
 * Get feature availability message
 */
export function getFeatureMessage(feature: keyof AccessLevel, year: number): string {
    const messages: Record<string, string> = {
        canViewPlacements: `Placement drives will be available from your 3rd year. Currently showing internship opportunities.`,
        canApplyPlacements: `You can apply to placements starting from your 3rd year.`,
        canViewSalaries: `Salary information will be visible from your 3rd year.`,
        canAccessAdvancedResume: `Advanced resume features will be available from your 3rd year.`,
        canAccessATSForPlacements: `ATS scoring for placements will be available from your 3rd year.`
    };

    return messages[feature] || 'This feature is not available for your year.';
}

/**
 * Get year-specific navigation items
 */
export function getYearBasedNavigation(year: 1 | 2 | 3 | 4) {
    const baseNav = [
        { href: '/student/internships', label: 'Internships', icon: 'Briefcase', years: [1, 2, 3, 4] },
        { href: '/student/resume-builder', label: 'Resume Builder', icon: 'FileText', years: [1, 2, 3, 4] },
        { href: '/student/ats-checker', label: 'ATS Checker', icon: 'CheckCircle', years: [1, 2, 3, 4] },
    ];

    const placementNav = [
        { href: '/student/opportunities', label: 'Campus Drives', icon: 'Building', years: [3, 4] },
        { href: '/student/jobs', label: 'Live Jobs', icon: 'Globe', years: [3, 4] },
        { href: '/student/placement-history', label: 'My Applications', icon: 'Clock', years: [3, 4] },
    ];

    const allNav = [...baseNav, ...placementNav];

    return allNav.filter(item => item.years.includes(year));
}
