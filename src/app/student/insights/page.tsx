/**
 * Modern Student Insights Dashboard - Premium Analytics
 * Real-time placement analytics with stunning visualizations
 */
'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    Award,
    Briefcase,
    Users,
    BarChart3,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApplicationService, DriveService, StudentService } from '@/lib/data-service';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

export default function InsightsPage() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        selected: 0,
        inProgress: 0,
        successRate: 0,
        avgPackage: 0,
        topCompanies: [] as any[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

        if (!user.rollNumber) {
            setLoading(false);
            return;
        }

        const apps = await ApplicationService.getAll();
        const studentApps = apps.filter(a => a.studentId === user.rollNumber);
        const drives = await DriveService.getAll();

        const selected = studentApps.filter(a => a.status === 'Selected').length;
        const successRate = studentApps.length > 0 ? (selected / studentApps.length) * 100 : 0;

        // Calculate avg package from selected applications
        let totalPackage = 0;
        studentApps.filter(a => a.status === 'Selected').forEach(app => {
            const drive = drives.find(d => d.id === app.driveId);
            if (drive) {
                totalPackage += (drive.ctcMin + drive.ctcMax) / 2;
            }
        });

        setStats({
            totalApplications: studentApps.length,
            selected,
            inProgress: studentApps.filter(a => a.status === 'Applied' || a.status === 'Shortlisted').length,
            successRate,
            avgPackage: selected > 0 ? Math.round(totalPackage / selected) : 0,
            topCompanies: drives.slice(0, 5),
        });

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600  bg-clip-text text-transparent mb-2">
                        Your Placement Insights
                    </h1>
                    <p className="text-gray-600">Track your progress with real-time analytics and AI-powered recommendations</p>
                </motion.div>

                {/* Key Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <InsightCard
                        icon={Briefcase}
                        label="Total Applications"
                        value={stats.totalApplications}
                        gradient="from-blue-500 to-cyan-500"
                        delay={0.1}
                    />
                    <InsightCard
                        icon={Award}
                        label="Offers Received"
                        value={stats.selected}
                        gradient="from-green-500 to-emerald-500"
                        delay={0.2}
                    />
                    <InsightCard
                        icon={Clock}
                        label="In Progress"
                        value={stats.inProgress}
                        gradient="from-yellow-500 to-orange-500"
                        delay={0.3}
                    />
                    <InsightCard
                        icon={TrendingUp}
                        label="Success Rate"
                        value={`${Math.round(stats.successRate)}%`}
                        gradient="from-purple-500 to-pink-500"
                        delay={0.4}
                    />
                </div>

                {/* Performance Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Average Package */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Average Package</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                                ₹{stats.avgPackage}
                            </span>
                            <span className="text-xl text-gray-600">LPA</span>
                        </div>
                        {stats.selected > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                Based on {stats.selected} offer{stats.selected > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Application Status Distribution */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Application Breakdown</h3>
                        </div>
                        <div className="space-y-3">
                            <StatusBar
                                label="Selected"
                                count={stats.selected}
                                total={stats.totalApplications}
                                color="bg-green-500"
                            />
                            <StatusBar
                                label="In Progress"
                                count={stats.inProgress}
                                total={stats.totalApplications}
                                color="bg-yellow-500"
                            />
                            <StatusBar
                                label="Others"
                                count={stats.totalApplications - stats.selected - stats.inProgress}
                                total={stats.totalApplications}
                                color="bg-gray-400"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* AI Recommendations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl p-6 text-white shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircle2 className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.totalApplications < 5 && (
                            <Recommendation text="Apply to more companies to increase your chances" />
                        )}
                        {stats.successRate > 0 && stats.successRate < 30 && (
                            <Recommendation text="Focus on companies matching your skillset and CGPA" />
                        )}
                        {stats.selected === 0 && stats.totalApplications > 3 && (
                            <Recommendation text="Consider updating your resume and practicing interviews" />
                        )}
                        {stats.selected > 0 && (
                            <Recommendation text="🎉 Congratulations! You're on the right track" />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function InsightCard({ icon: Icon, label, value, gradient, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </motion.div>
    );
}

function StatusBar({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{label}</span>
                <span className="font-semibold text-gray-900">{count}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
}

function Recommendation({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2 text-white/90">
            <span className="text-white">•</span>
            <p className="text-sm">{text}</p>
        </div>
    );
}
