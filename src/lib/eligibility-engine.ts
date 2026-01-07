/**
 * Eligibility Engine
 * Core logic for checking student eligibility against drive criteria
 */

import { StudentProfile, Department } from '@/types/student';
import { Drive, EligibilityRule, EligibilityField, EligibilityOperator } from '@/types/drive';

export interface EligibilityResult {
    eligible: boolean;
    partiallyEligible: boolean; // Missing 1-2 criteria
    results: RuleResult[];
    passedCount: number;
    failedCount: number;
    missingCriteria: string[];
    suggestions: string[];
}

export interface RuleResult {
    rule: EligibilityRule;
    passed: boolean;
    message: string;
    studentValue: any;
    requiredValue: any;
    severity: 'critical' | 'moderate' | 'minor';
}

/**
 * Main eligibility check function
 */
export function checkEligibility(
    student: StudentProfile,
    drive: Drive
): EligibilityResult {
    const results: RuleResult[] = drive.eligibilityCriteria.map(rule =>
        evaluateRule(student, rule)
    );

    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;

    const eligible = failedCount === 0;
    const partiallyEligible = failedCount > 0 && failedCount <= 2;

    const missingCriteria = results
        .filter(r => !r.passed)
        .map(r => r.message);

    const suggestions = generateSuggestions(results.filter(r => !r.passed), student);

    return {
        eligible,
        partiallyEligible,
        results,
        passedCount,
        failedCount,
        missingCriteria,
        suggestions,
    };
}

/**
 * Evaluate a single eligibility rule
 */
function evaluateRule(
    student: StudentProfile,
    rule: EligibilityRule
): RuleResult {
    const studentValue = getFieldValue(student, rule.field);
    let passed = false;
    let message = '';
    let severity: 'critical' | 'moderate' | 'minor' = 'moderate';

    switch (rule.operator) {
        case '>':
            passed = Number(studentValue) > Number(rule.value);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue} > ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Requires > ${rule.value} (You: ${studentValue})`;
            severity = 'critical';
            break;

        case '>=':
            passed = Number(studentValue) >= Number(rule.value);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue} ≥ ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Requires ≥ ${rule.value} (You: ${studentValue})`;
            severity = 'critical';
            break;

        case '<':
            passed = Number(studentValue) < Number(rule.value);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue} < ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Requires < ${rule.value} (You: ${studentValue})`;
            severity = 'moderate';
            break;

        case '<=':
            passed = Number(studentValue) <= Number(rule.value);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue} ≤ ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Requires ≤ ${rule.value} (You: ${studentValue})`;
            severity = 'moderate';
            break;

        case '=':
            passed = studentValue === rule.value;
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue}`
                : `❌ ${formatFieldName(rule.field)}: Requires ${rule.value} (You: ${studentValue})`;
            severity = 'critical';
            break;

        case '!=':
            passed = studentValue !== rule.value;
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: Not ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Must not be ${rule.value}`;
            severity = 'minor';
            break;

        case 'IN':
            passed = Array.isArray(rule.value) && rule.value.includes(studentValue);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue}`
                : `❌ ${formatFieldName(rule.field)}: Must be one of ${rule.value.join(', ')} (You: ${studentValue})`;
            severity = 'critical';
            break;

        case 'NOT IN':
            passed = Array.isArray(rule.value) && !rule.value.includes(studentValue);
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: ${studentValue}`
                : `❌ ${formatFieldName(rule.field)}: Cannot be ${rule.value.join(', ')}`;
            severity = 'minor';
            break;

        case 'CONTAINS':
            passed = Array.isArray(studentValue) && studentValue.some(val =>
                rule.value.toLowerCase() === val.toLowerCase()
            );
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: Has ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Requires skill - ${rule.value}`;
            severity = 'moderate';
            break;

        case 'NOT CONTAINS':
            passed = !Array.isArray(studentValue) || !studentValue.some(val =>
                rule.value.toLowerCase() === val.toLowerCase()
            );
            message = passed
                ? `✅ ${formatFieldName(rule.field)}: Doesn't have ${rule.value}`
                : `❌ ${formatFieldName(rule.field)}: Should not have ${rule.value}`;
            severity = 'minor';
            break;

        default:
            passed = false;
            message = `❓ Unknown operator: ${rule.operator}`;
            severity = 'critical';
    }

    return {
        rule,
        passed,
        message,
        studentValue,
        requiredValue: rule.value,
        severity,
    };
}

/**
 * Get field value from student profile
 */
function getFieldValue(student: StudentProfile, field: EligibilityField): any {
    const fieldMap: Record<EligibilityField, any> = {
        cgpa: student.currentCGPA,
        activeBacklogs: student.activeBacklogs,
        branch: student.branch,
        batch: student.batch,
        gender: 'Other', // Add to StudentProfile if needed
        tenthPercentage: student.tenthPercentage,
        twelfthPercentage: student.twelfthPercentage,
        skills: [...student.programmingLanguages, ...student.frameworks, ...student.tools],
        hasInternship: student.internships.length > 0,
    };

    return fieldMap[field];
}

/**
 * Format field name for display
 */
function formatFieldName(field: EligibilityField): string {
    const nameMap: Record<EligibilityField, string> = {
        cgpa: 'CGPA',
        activeBacklogs: 'Active Backlogs',
        branch: 'Branch',
        batch: 'Batch',
        gender: 'Gender',
        tenthPercentage: '10th Percentage',
        twelfthPercentage: '12th Percentage',
        skills: 'Skills',
        hasInternship: 'Internship Experience',
    };

    return nameMap[field] || field;
}

/**
 * Generate actionable suggestions for failed criteria
 */
function generateSuggestions(
    failedResults: RuleResult[],
    student: StudentProfile
): string[] {
    const suggestions: string[] = [];

    failedResults.forEach(result => {
        const field = result.rule.field;
        const diff = result.requiredValue - result.studentValue;

        switch (field) {
            case 'cgpa':
                if (diff > 0 && diff <= 0.5) {
                    suggestions.push(
                        `You're ${diff.toFixed(2)} points away from the CGPA requirement. Focus on improving your grades this semester.`
                    );
                } else if (diff > 0.5) {
                    suggestions.push(
                        `CGPA requirement is ${diff.toFixed(2)} points higher. Consider taking additional courses or improving in current subjects.`
                    );
                }
                break;

            case 'activeBacklogs':
                if (result.studentValue > 0) {
                    suggestions.push(
                        `Clear ${result.studentValue} active backlog(s) to become eligible. Check with academic office for re-examination dates.`
                    );
                }
                break;

            case 'skills':
                suggestions.push(
                    `Learn ${result.requiredValue} through online courses. Recommended: Coursera, Udemy, or freeCodeCamp.`
                );
                break;

            case 'branch':
                suggestions.push(
                    `This drive is only for ${Array.isArray(result.requiredValue) ? result.requiredValue.join(', ') : result.requiredValue} students. Look for similar opportunities open to ${student.branch}.`
                );
                break;

            case 'hasInternship':
                suggestions.push(
                    'Gain internship experience by applying to summer internships or participating in virtual internships.'
                );
                break;

            case 'tenthPercentage':
            case 'twelfthPercentage':
                suggestions.push(
                    `This criteria is based on past performance and cannot be changed. Focus on other opportunities.`
                );
                break;

            default:
                suggestions.push(`Work on improving ${formatFieldName(field)}.`);
        }
    });

    return suggestions;
}

/**
 * Batch eligibility check for multiple drives
 */
export function checkEligibilityBatch(
    student: StudentProfile,
    drives: Drive[]
): Map<string, EligibilityResult> {
    const results = new Map<string, EligibilityResult>();

    drives.forEach(drive => {
        results.set(drive.id, checkEligibility(student, drive));
    });

    return results;
}

/**
 * Get eligible students count for a drive (admin use)
 */
export function getEligibleStudentsCount(
    students: StudentProfile[],
    drive: Drive
): {
    eligible: number;
    partiallyEligible: number;
    notEligible: number;
    eligibleStudents: string[]; // Student IDs
} {
    let eligible = 0;
    let partiallyEligible = 0;
    let notEligible = 0;
    const eligibleStudents: string[] = [];

    students.forEach(student => {
        const result = checkEligibility(student, drive);

        if (result.eligible) {
            eligible++;
            eligibleStudents.push(student.id);
        } else if (result.partiallyEligible) {
            partiallyEligible++;
        } else {
            notEligible++;
        }
    });

    return {
        eligible,
        partiallyEligible,
        notEligible,
        eligibleStudents,
    };
}

/**
 * Get drives for which student is eligible
 */
export function getEligibleDrives(
    student: StudentProfile,
    drives: Drive[]
): {
    fullyEligible: Drive[];
    partiallyEligible: Drive[];
    notEligible: Drive[];
} {
    const fullyEligible: Drive[] = [];
    const partiallyEligible: Drive[] = [];
    const notEligible: Drive[] = [];

    drives.forEach(drive => {
        const result = checkEligibility(student, drive);

        if (result.eligible) {
            fullyEligible.push(drive);
        } else if (result.partiallyEligible && drive.allowPartiallyEligible) {
            partiallyEligible.push(drive);
        } else {
            notEligible.push(drive);
        }
    });

    return {
        fullyEligible,
        partiallyEligible,
        notEligible,
    };
}
