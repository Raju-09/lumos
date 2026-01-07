/**
 * ATS Score Checker - AI-Powered Resume Analysis
 * Implements visualization for Hybrid ATS Scoring (Structure, Keywords, Role Relevance, Eligibility)
 */
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Target, TrendingUp, AlertCircle, Loader2, FileText, Sparkles, Building2 } from 'lucide-react';
import { calculateATSScore, ATSScoreResult } from '@/lib/gemini-ai';
import { DriveService } from '@/lib/data-service';
import { getAccessLevel, filterDrivesByYear } from '@/lib/access-control';
import { motion } from 'framer-motion';

export default function ATSCheckerPage() {
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [drives, setDrives] = useState<any[]>([]);
    const [selectedDrive, setSelectedDrive] = useState<any>(null);
    const [resumeContent, setResumeContent] = useState('');
    const [atsScore, setAtsScore] = useState<ATSScoreResult | null>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [accessLevel, setAccessLevel] = useState<any>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');

    // Handle file upload - extract text from files
    const handleFileUpload = async (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            alert('File too large. Maximum 5MB allowed.');
            return;
        }

        setUploadedFileName(file.name);

        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const text = await file.text();
            setResumeContent(text);
        } else if (file.type === 'application/pdf') {
            // In a real production app, we would use a server-side parser or pdf.js
            // For now, we guide the user to copy-paste for accuracy while acknowledging the upload
            setResumeContent(`[File Uploaded: ${file.name}]\n\n⚠️ TIP: For the most accurate ATS score, please copy and paste the text content of your PDF here directly.`);
        } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            setResumeContent(`[File Uploaded: ${file.name}]\n\n⚠️ TIP: For the most accurate ATS score, please copy and paste the text content of your document here directly.`);
        } else {
            alert('Unsupported file format. Please use PDF, DOC, DOCX, or TXT.');
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        setStudentData(user);

        if (user.academicYear) {
            setAccessLevel(getAccessLevel(user.academicYear));
        }

        // Load available drives
        const allDrives = await DriveService.getAll();
        const filteredDrives = user.academicYear
            ? filterDrivesByYear(allDrives, user.academicYear)
            : allDrives;

        setDrives(filteredDrives.filter(d => d.status === 'OPEN'));
        setLoading(false);
    };

    const handleAnalyze = async () => {
        if (!selectedDrive || !resumeContent.trim()) {
            alert('Please select a drive and enter your resume content');
            return;
        }

        setAnalyzing(true);
        try {
            // Need to construct a temporary student object if missing fields for the hybrid check
            // In a real app, this comes from the full profile.
            const fullStudentData = {
                name: studentData?.name || 'Student',
                branch: studentData?.branch || 'CSE',
                academicYear: studentData?.academicYear || 4,
                cgpa: studentData?.cgpa || 8.0,
                skills: studentData?.skills || [],
                projects: [],
                internships: []
            };

            const result = await calculateATSScore(
                resumeContent,
                selectedDrive,
                fullStudentData
            );

            setAtsScore(result);
        } catch (error) {
            console.error('Error analyzing resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">ATS Score Checker</h1>
                        <p className="text-slate-500 dark:text-slate-400">Analyze your resume against job requirements</p>
                    </div>
                </div>

                {accessLevel && !accessLevel.canAccessATSForPlacements && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            💡 Currently showing internship opportunities. Placement ATS scoring unlocks in 3rd year!
                        </p>
                    </div>
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Input Section */}
                <div className="space-y-6">
                    {/* Drive Selection */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            Select Job Opening
                        </h3>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : drives.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No open drives available</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {drives.map((drive) => (
                                    <button
                                        key={drive.id}
                                        onClick={() => setSelectedDrive(drive)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${selectedDrive?.id === drive.id
                                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="font-semibold text-slate-900 dark:text-white">{drive.companyName}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">{drive.role}</div>
                                        <div className="text-xs text-slate-500 mt-2 flex gap-3">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">{drive.type}</span>
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-300">₹{drive.ctcMin}-{drive.ctcMax} LPA</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Resume Input - With File Upload */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <h3 className="text-lg font-medium text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            Your Resume
                        </h3>

                        {/* File Upload Zone */}
                        <div
                            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer mb-4"
                            onClick={() => document.getElementById('resume-upload')?.click()}
                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-50'); }}
                            onDragLeave={(e) => { e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50'); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-50');
                                const file = e.dataTransfer.files[0];
                                if (file) handleFileUpload(file);
                            }}
                        >
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file);
                                }}
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Drop your resume here or <span className="text-indigo-600">browse</span>
                                </p>
                                <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX, TXT (Max 5MB)</p>
                                {uploadedFileName && (
                                    <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        {uploadedFileName}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Or Divider */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 h-px bg-slate-200" />
                            <span className="text-xs text-slate-400 font-medium">OR PASTE TEXT</span>
                            <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <textarea
                            value={resumeContent}
                            onChange={(e) => setResumeContent(e.target.value)}
                            placeholder="Paste your resume content here for analysis..."
                            className="w-full h-40 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                        />

                        <div className="mt-4">
                            <button
                                onClick={handleAnalyze}
                                disabled={analyzing || !selectedDrive || !resumeContent.trim()}
                                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-5 h-5" />
                                        Calculate ATS Score
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Results Section */}
                <div>
                    {atsScore ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Overall Score with Eligibility Tag  */}
                            {/* CHECK 4 Visualization */}
                            <div className={`rounded-xl border-2 p-8 ${getScoreBgColor(atsScore.score)} shadow-sm relative overflow-hidden`}>
                                <div className="absolute top-4 right-4">
                                    {atsScore.isEligible ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">ELIGIBLE ✅</span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">NOT ELIGIBLE ❌</span>
                                    )}
                                </div>

                                <div className="text-center relative z-10">
                                    <div className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">ATS Compatibility Code</div>
                                    <div className={`text-7xl font-bold ${getScoreColor(atsScore.score)}`}>
                                        {atsScore.score}
                                    </div>
                                    <div className="text-sm text-slate-600 mt-2">Maximum Score: 100</div>
                                </div>
                            </div>

                            {/* Score Breakdown - PART 3: 4 CHECKS */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Scoring Breakdown</h3>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <ScoreItem label="Structure Check" score={atsScore.breakdown.structure} max={20} />
                                    <ScoreItem label="Skills Match" score={atsScore.breakdown.skillsMatch} max={40} />
                                    <ScoreItem label="Experience" score={atsScore.breakdown.experience} max={25} />
                                    <ScoreItem label="Education" score={atsScore.breakdown.education} max={15} />
                                </div>
                            </div>

                            {/* Missing Keywords - CHECK 2 */}
                            {atsScore.missingKeywords.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                    <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                        Missing Critical Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {atsScore.missingKeywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-sm rounded-lg border border-amber-100 dark:border-amber-800 font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Strengths - New Field */}
                            {atsScore.strengths && atsScore.strengths.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                    <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        Strengths & Matches
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {atsScore.strengths.map((strength, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-lg border border-green-100 dark:border-green-800 font-medium"
                                            >
                                                {strength}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {atsScore.suggestions.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                    <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                        Improvement Plan
                                    </h3>
                                    <ul className="space-y-3">
                                        {atsScore.suggestions.map((suggestion, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                <span className="text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold">→</span>
                                                <span className="leading-relaxed">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-indigo-100 dark:border-slate-700 p-10 text-center h-full flex flex-col items-center justify-center">
                            <Target className="w-16 h-16 text-indigo-400 mb-6" />
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Ready to Analyze</h3>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xs mx-auto">
                                Select a job opening and paste your resume to get your precise ATS compatibility score.
                            </p>

                            <div className="w-full bg-white/60 dark:bg-black/20 p-4 rounded-lg backdrop-blur-sm border border-indigo-100 dark:border-slate-700 max-w-sm text-left text-sm space-y-3">
                                <p className="font-medium text-indigo-900 dark:text-indigo-300">Analysis Includes:</p>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span>Structure & Formatting Check</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                    <span>Keyword Relevance Score</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    <span>Role Eligibility Check</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ScoreItem({ label, score, max }: { label: string; score: number, max: number }) {
    const percentage = Math.round((score / max) * 100);
    const barColor = (p: number) => {
        if (p >= 80) return 'bg-green-500';
        if (p >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    return (
        <div className="text-center">
            <div className="flex justify-between text-xs mb-1 text-slate-500 dark:text-slate-400 font-medium">
                <span>{label}</span>
                <span>{score}/{max}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${barColor(percentage)}`}
                />
            </div>
        </div>
    );
}
