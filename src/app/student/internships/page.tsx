/**
 * Internships Page - For 1st & 2nd Year Students
 * Features: AI Recommendations, Skill-based matching
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Compass, ArrowRight, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { recommendInternships, Student } from '@/lib/gemini-ai';
import { getAccessLevel } from '@/lib/access-control';

export default function InternshipsPage() {
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        setStudentData(user);

        if (user.academicYear && (user.academicYear === 1 || user.academicYear === 2)) {
            loadRecommendations(user);
        }
    }, []);

    const loadRecommendations = async (user: any) => {
        setLoading(true);
        try {
            const recs = await recommendInternships({
                year: user.academicYear || 1,
                skills: user.skills || ['Python', 'Communication'],
                interests: user.interests || ['Technology', 'Design']
            });
            setRecommendations(recs);
        } catch (error) {
            console.error('Failed to load internship recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative"
            >
                <div className="relative z-10 w-full md:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Compass className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium text-emerald-100">Early Career Program</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        Build Your Career Foundation
                    </h1>
                    <p className="text-emerald-100 text-lg mb-6">
                        As a {studentData?.academicYear === 1 ? '1st' : '2nd'} year student, focus on internships and skill-building to prepare for future placements.
                    </p>
                </div>

                {/* Decorative Pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-[url('/grid.svg')] bg-cover" />
            </motion.div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-teal-600" />
                                AI Recommended Roles
                            </h2>
                            <button
                                onClick={() => studentData && loadRecommendations(studentData)}
                                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium"
                            >
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12 bg-white rounded-xl border border-gray-200">
                                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                                <span className="ml-3 text-gray-600 dark:text-gray-300">AI is analyzing your profile...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {recommendations.map((role, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
                                        onClick={() => window.location.href = `/student/jobs?q=${encodeURIComponent(role)}`}
                                    >
                                        <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-3 group-hover:bg-teal-100 dark:group-hover:bg-teal-800/50 transition-colors">
                                            <Lightbulb className="w-5 h-5 text-teal-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{role}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Recommended based on your skills</p>
                                        <div className="flex items-center text-sm text-teal-600 dark:text-teal-400 font-medium">
                                            Explore Opportunities <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-teal-600" />
                            Learning Roadmap
                        </h2>
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                            <div className="space-y-6">
                                <RoadmapItem
                                    step={1}
                                    title="Master Core Concepts"
                                    desc="Focus on Data Structures, Algorithms, and core CS subjects."
                                    status="current"
                                />
                                <RoadmapItem
                                    step={2}
                                    title="Build Projects"
                                    desc="Create 2-3 real-world projects to showcase your skills."
                                    status="upcoming"
                                />
                                <RoadmapItem
                                    step={3}
                                    title="First Internship"
                                    desc="Gain industry experience through a summer internship."
                                    status="upcoming"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
                        <div className="space-y-4">
                            <ProgressItem label="Profile matches" value="85%" color="bg-teal-500" />
                            <ProgressItem label="Skills acquired" value="12/20" color="bg-purple-500" />
                            <ProgressItem label="Projects built" value="2" color="bg-orange-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-blue-100 dark:border-slate-700 p-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Resume Tip</h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400 mb-4">
                            Early experience matters! Add your academic projects and hackathon participation to your resume matched with basic skills.
                        </p>
                        <a href="/student/resume-builder" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                            Open Resume Builder
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RoadmapItem({ step, title, desc, status }: any) {
    return (
        <div className="flex gap-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${status === 'current' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500'
                }`}>
                {step}
            </div>
            <div>
                <h4 className={`font-medium ${status === 'current' ? 'text-teal-900 dark:text-teal-400' : 'text-gray-900 dark:text-white'}`}>{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
        </div>
    );
}

function ProgressItem({ label, value, color }: any) {
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">{label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{value}</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} w-[60%]`} />
            </div>
        </div>
    );
}
