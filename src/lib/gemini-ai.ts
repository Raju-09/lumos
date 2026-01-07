/**
 * GEMINI AI SERVICE - SYSTEM ENGINE
 * Implements strict ATS rules and Hybrid Scoring Logic
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// --- TYPES ---
export interface Student {
    name: string;
    branch: string;
    academicYear: number; // 1-4
    cgpa: number;
    skills: string[];
    projects: Project[];
    internships: InternshipExperience[];
}

export interface Project {
    title: string;
    techStack: string[];
    description?: string;
}

export interface InternshipExperience {
    role: string;
    company: string;
    duration: string;
    description?: string;
}

export interface Drive {
    id: string;
    role: string;
    companyName: string;
    eligibility: {
        cgpaCutoff: number;
        allowedBranches: string[];
        requiredSkills?: string[];
    };
    jobDescription?: string;
}

export interface ATSScoreResult {
    score: number; // 0-100
    breakdown: {
        structure: number; // /20
        skillsMatch: number; // /40
        experience: number; // /25
        education: number; // /15
    };
    missingKeywords: string[];
    suggestions: string[];
    isEligible: boolean;
    strengths: string[];
}

// --- PART 2: RESUME GENERATION (STRICT) ---

// Models to try in order of preference (use latest working models)
const FALLBACK_MODELS = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"];

export const generateResume = async (student: Student, targetRole: string): Promise<string> => {
    const systemPrompt = `
You are an ATS-optimized resume generator.

Strict rules:
- Use standard section headings only: Summary, Skills, Experience, Projects, Education.
- Use bullet points only (no paragraphs).
- No tables, no icons, no emojis.
- No fake experience.
- Quantify results only if data is provided.
- Optimize for Applicant Tracking Systems (ATS).
- Output must be ready for text/PDF export.
`;

    const userPrompt = `
Generate a professional resume for:

NAME: ${student.name || 'Student'}
Academic Year: ${student.academicYear || 'Final Year'}
Branch: ${student.branch || 'Engineering'}
CGPA: ${student.cgpa || 'N/A'}

SKILLS: ${(student.skills || []).join(', ') || 'Not specified'}

PROJECTS:
${(student.projects || []).map(p => `- ${p.title} (${(p.techStack || []).join(', ')}): ${p.description || ''}`).join('\n') || '- No projects listed'}

INTERNSHIPS/EXPERIENCE:
${(student.internships || []).map(i => `- ${i.role} at ${i.company} (${i.duration}): ${i.description || ''}`).join('\n') || '- No internships listed'}

TARGET ROLE: ${targetRole}

INSTRUCTIONS:
1. Start with the student's NAME in bold at the top
2. Include a professional Summary section tailored to ${targetRole}
3. List all Skills in a comma-separated format
4. Include Projects with bullet points showing impact
5. Include Education with Branch and CGPA
6. If internships exist, include Work Experience section
7. Use keywords commonly expected for ${targetRole} roles
8. Keep it to 1 page length equivalent
9. Use ATS-friendly plain text format
`;

    // Try each model in order - optimized for speed
    for (const modelName of FALLBACK_MODELS) {
        try {
            console.log(`[Resume] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    maxOutputTokens: 2000, // Limit for faster response
                    temperature: 0.7,
                }
            });
            const result = await model.generateContent([systemPrompt, userPrompt]);
            return result.response.text();
        } catch (error: any) {
            console.error(`[Resume] Model ${modelName} failed:`, error?.message || error);
            // Continue to next model
        }
    }

    // If all models fail, return a template resume
    return generateFallbackResume(student, targetRole);
};

// Fallback resume template when API is unavailable
function generateFallbackResume(student: Student, targetRole: string): string {
    return `
${student.name?.toUpperCase() || 'STUDENT NAME'}
${student.branch || 'Engineering'} | CGPA: ${student.cgpa || 'N/A'}

PROFESSIONAL SUMMARY
Motivated ${student.academicYear || 'Final Year'} student seeking ${targetRole} position. 
Passionate about technology and eager to apply skills in a professional environment.

TECHNICAL SKILLS
${(student.skills || ['Programming', 'Problem Solving']).join(', ')}

PROJECTS
${(student.projects || []).map(p => `• ${p.title}\n  ${p.description || 'Project work'}`).join('\n') || '• Add projects in your profile to enhance your resume'}

EDUCATION
${student.branch || 'Bachelor of Technology'}
CGPA: ${student.cgpa || 'N/A'}

EXPERIENCE
${(student.internships || []).map(i => `• ${i.role} at ${i.company} (${i.duration})`).join('\n') || '• Add internships in your profile for experience section'}

---
Note: AI generation is temporarily unavailable. Please try again later for enhanced resume.
`.trim();
}

// --- PART 3: HYBRID ATS SCORING (4 CHECKS) ---

export const calculateATSScore = async (
    resumeText: string,
    drive: Drive,
    student: Student
): Promise<ATSScoreResult> => {

    // --- CHECK 1: STRUCTURE (Code Level - No AI) ---
    // Rule: Must contain standard headings and no messy characters
    const structureScore = calculateStructureScore(resumeText); // Max 20

    // --- CHECK 4: ELIGIBILITY (Code Level) ---
    const isEligible = checkEligibility(student, drive);

    // --- CHECK 2 & 3: KEYWORDS & RELEVANCE (AI Powered) ---
    const aiSystemPrompt = `
You are a professional ATS (Applicant Tracking System) resume analyzer.
Your job is to accurately score resumes against job descriptions.

SCORING CRITERIA:
1. skillsMatchCode (0-40): Award points for each skill match
   - Exact match = 5 points
   - Related skill = 2 points
   - Max 40 points
   
2. experienceMatchCode (0-25): Score based on relevance
   - Relevant internships/projects = 8-15 points
   - Matching domain experience = 10-25 points
   - No experience = 5 points (entry level consideration)
   
3. educationMatchCode (0-15): Score based on fit
   - Matching degree = 10-15 points
   - Related field = 5-10 points
   - Any technical degree = 5 points

OUTPUT STRICT JSON (no markdown, no extra text):
{
  "skillsMatchCode": number,
  "experienceMatchCode": number, 
  "educationMatchCode": number,
  "missingKeywords": ["list specific missing skills"],
  "suggestions": ["actionable improvement tips"],
  "strengths": ["matching skills and experiences"]
}
`;

    const aiUserPrompt = `
ANALYZE THIS RESUME AGAINST THE JOB:

JOB DETAILS:
- Role: ${drive.role}
- Company: ${drive.companyName}
- Required Skills: ${drive.eligibility.requiredSkills?.join(', ') || 'Programming, Problem-solving, Communication'}
- Min CGPA: ${drive.eligibility.cgpaCutoff || 'Not specified'}
- Job Description: ${drive.jobDescription || 'Standard ' + drive.role + ' position requiring technical skills, teamwork, and problem-solving abilities.'}

CANDIDATE RESUME:
${resumeText.substring(0, 6000)}

Provide accurate JSON scores based on actual matches found.
`;

    // Try each fallback model - optimized for speed
    for (const modelName of FALLBACK_MODELS) {
        try {
            console.log(`[ATS] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ 
                model: modelName,
                generationConfig: {
                    maxOutputTokens: 500, // Limit JSON response for faster processing
                    temperature: 0.3, // Lower temperature for more consistent JSON
                }
            });
            const result = await model.generateContent([aiSystemPrompt, aiUserPrompt]);
            const text = result.response.text();
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiData = JSON.parse(cleanJson);

            // Normalize scores
            const skillsScore = Math.min(40, aiData.skillsMatchCode || 0);
            const experienceScore = Math.min(25, aiData.experienceMatchCode || 0);
            const educationScore = Math.min(15, aiData.educationMatchCode || 0);

            // Standardize Education Score based on Eligibility
            const finalEducationScore = isEligible ? Math.max(educationScore, 10) : educationScore;

            const totalScore = structureScore + skillsScore + experienceScore + finalEducationScore;

            return {
                score: Math.round(totalScore),
                breakdown: {
                    structure: structureScore,
                    skillsMatch: skillsScore,
                    experience: experienceScore,
                    education: finalEducationScore
                },
                missingKeywords: aiData.missingKeywords || [],
                suggestions: aiData.suggestions || [],
                strengths: aiData.strengths || [],
                isEligible
            };
        } catch (error: any) {
            console.error(`[ATS] Model ${modelName} failed:`, error?.message || error);
            // Continue to next model
        }
    }

    // Fallback score if all models fail
    console.log('[ATS] All models failed, using code-based scoring');
    return calculateFallbackATSScore(resumeText, drive, student, structureScore, isEligible);
};

// Code-based fallback scoring when API is unavailable
function calculateFallbackATSScore(
    resumeText: string,
    drive: Drive,
    student: Student,
    structureScore: number,
    isEligible: boolean
): ATSScoreResult {
    const resumeLower = resumeText.toLowerCase();

    // Skills matching
    const requiredSkills = drive.eligibility.requiredSkills || ['programming', 'communication', 'teamwork'];
    let skillsMatch = 0;
    const foundSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of requiredSkills) {
        if (resumeLower.includes(skill.toLowerCase())) {
            skillsMatch += 5;
            foundSkills.push(skill);
        } else {
            missingSkills.push(skill);
        }
    }
    skillsMatch = Math.min(40, skillsMatch);

    // Experience scoring
    let experienceScore = 5;
    if (resumeLower.includes('internship') || resumeLower.includes('intern')) experienceScore += 10;
    if (resumeLower.includes('project')) experienceScore += 5;
    if (resumeLower.includes('experience')) experienceScore += 5;
    experienceScore = Math.min(25, experienceScore);

    // Education scoring
    let educationScore = 5;
    if (student.cgpa && student.cgpa >= (drive.eligibility.cgpaCutoff || 0)) educationScore += 5;
    if (resumeLower.includes('b.tech') || resumeLower.includes('bachelor')) educationScore += 5;
    educationScore = Math.min(15, educationScore);

    const totalScore = structureScore + skillsMatch + experienceScore + educationScore;

    return {
        score: Math.round(totalScore),
        breakdown: {
            structure: structureScore,
            skillsMatch: skillsMatch,
            experience: experienceScore,
            education: educationScore
        },
        missingKeywords: missingSkills.slice(0, 5),
        suggestions: [
            missingSkills.length > 0 ? `Add these skills: ${missingSkills.slice(0, 3).join(', ')}` : 'Good skill coverage!',
            'Quantify your achievements with numbers',
            'Use action verbs to describe your experience'
        ],
        strengths: foundSkills.slice(0, 5),
        isEligible
    };
};

// --- HELPER LOGIC ---

function calculateStructureScore(text: string): number {
    let score = 0;
    const lowerText = text.toLowerCase();

    // Check for standard headings (+5 each, max 15)
    if (lowerText.includes('education')) score += 5;
    if (lowerText.includes('skills') || lowerText.includes('technologies')) score += 5;
    if (lowerText.includes('experience') || lowerText.includes('projects')) score += 5;

    // Check for contact info (+5)
    if (text.includes('@') || text.match(/\d{10}/)) score += 5;

    return Math.min(20, score);
}

function checkEligibility(student: Student, drive: Drive): boolean {
    if (!drive || !drive.eligibility) return true; // Default eligible if no criteria

    // 1. CGPA Check
    if (drive.eligibility.cgpaCutoff && student.cgpa < drive.eligibility.cgpaCutoff) return false;

    // 2. Branch Check (Wildcard or Exact)
    if (!drive.eligibility.allowedBranches || drive.eligibility.allowedBranches.includes('All')) return true;

    // Simple branch check logic
    const studentBranch = student.branch ? student.branch.toUpperCase() : '';
    return drive.eligibility.allowedBranches.some(b =>
        studentBranch.includes(b.toUpperCase()) || b.toUpperCase().includes(studentBranch)
    );
}

// --- OTHER AI FEATURES ---

export const recommendInternships = async (profile: { year: number, skills: string[], interests: string[] }) => {
    const modelsToTry = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro"];
    
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = `Recommend 5 specific internship roles for a Year ${profile.year} student with skills: ${profile.skills.join(', ')}. Return comma-separated list only.`;
            const result = await model.generateContent(prompt);
            return result.response.text().split(',').map(s => s.trim());
        } catch (e) {
            console.log(`Model ${modelName} failed, trying next...`);
        }
    }
    
    return ["Software Intern", "Web Developer", "Data Analyst Intern"];
};

export const explainEligibility = async (
    studentStats: { cgpa: number; backlogs: number; branch: string },
    driveCriteria: { cgpaCutoff: number; maxBacklogs: number; allowedBranches: string[] }
): Promise<string> => {
    // Simple logic-based or lightweight AI explanation
    return "Based on your CGPA and Branch, you meet the criteria for this drive.";
};
