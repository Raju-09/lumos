"use client";

import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import {
    FileText,
    Clock,
    CheckCircle,
    Award,
    ArrowRight,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { OpportunityRadar } from "@/components/student/opportunity-radar";
import { UpcomingTimeline } from "@/components/student/upcoming-timeline";
import { StatCard } from "@/components/student/stat-card";
import { GapAnalysis } from "@/components/student/gap-analysis";

export default function StudentDashboard() {
    const { user } = useAuth();
    const firstName = user?.name?.split(" ")[0] || "Student";

    return (
        <div className="min-h-screen p-6 space-y-8">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-2xl p-8 border border-primary/10"
            >
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-radial opacity-50" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 mb-3"
                    >
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Placement Season 2026
                        </span>
                    </motion.div>

                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="text-gradient">{firstName}</span>
                    </h1>

                    <p className="text-muted-foreground text-lg">
                        Here's your placement cockpit. Track opportunities, prepare for interviews, and land your dream job.
                    </p>
                </div>

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-4 right-4 text-6xl opacity-10"
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    🚀
                </motion.div>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Applications"
                    value={12}
                    icon={FileText}
                    color="blue"
                    trend={{ value: 15, isPositive: true }}
                    onClick={() => window.location.href = '/student/applications'}
                />
                <StatCard
                    title="Pending Reviews"
                    value={5}
                    icon={Clock}
                    color="yellow"
                />
                <StatCard
                    title="Shortlisted"
                    value={2}
                    icon={CheckCircle}
                    color="green"
                    trend={{ value: 100, isPositive: true }}
                />
                <StatCard
                    title="Offers"
                    value={1}
                    icon={Award}
                    color="purple"
                />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Opportunity Radar */}
                <div className="lg:col-span-1">
                    <OpportunityRadar
                        eligibleCount={5}
                        urgentCount={2}
                        highPayingCount={3}
                    />
                </div>

                {/* Middle Column - Upcoming Timeline */}
                <div className="lg:col-span-2">
                    <UpcomingTimeline />
                </div>
            </div>

            {/* Gap Analysis & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <GapAnalysis
                        missedOpportunities={3}
                        reasons={[
                            { type: 'cgpa', count: 2, message: 'CGPA 0.2 below cutoff' },
                            { type: 'skills', count: 1, message: 'Missing React.js skill' },
                        ]}
                        suggestions={[
                            'Focus on improving CGPA this semester - you\'re just 0.2 points away!',
                            'Complete React.js certification course from Udemy or Coursera',
                            'Build a full-stack project to showcase practical skills',
                        ]}
                    />
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border rounded-xl p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <QuickActionButton
                            href="/student/profile"
                            icon="👤"
                            title="Complete Profile"
                            description="92% complete"
                            color="blue"
                        />
                        <QuickActionButton
                            href="/student/opportunities"
                            icon="💼"
                            title="Browse Drives"
                            description="5 new opportunities"
                            color="green"
                        />
                        <QuickActionButton
                            href="/student/applications"
                            icon="📄"
                            title="Track Applications"
                            description="3 pending updates"
                            color="purple"
                        />
                        <QuickActionButton
                            href="/student/resources"
                            icon="📚"
                            title="Prep Resources"
                            description="Interview prep"
                            color="orange"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Application Activity Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Link
                        href="/student/applications"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="space-y-4">
                    <ActivityItem
                        company="Google"
                        status="Shortlisted for Technical Round"
                        time="2 hours ago"
                        color="green"
                        emoji="🎉"
                    />
                    <ActivityItem
                        company="Microsoft"
                        status="Online Assessment Link Sent"
                        time="Yesterday"
                        color="blue"
                        emoji="📧"
                    />
                    <ActivityItem
                        company="Amazon"
                        status="Application Submitted"
                        time="2 days ago"
                        color="gray"
                        emoji="✅"
                    />
                </div>
            </motion.div>
        </div>
    );
}

// Quick Action Button Component
function QuickActionButton({
    href,
    icon,
    title,
    description,
    color
}: {
    href: string;
    icon: string;
    title: string;
    description: string;
    color: 'blue' | 'green' | 'purple' | 'orange';
}) {
    const colorMap = {
        blue: 'hover:bg-blue-500/10 hover:border-blue-500/30',
        green: 'hover:bg-green-500/10 hover:border-green-500/30',
        purple: 'hover:bg-purple-500/10 hover:border-purple-500/30',
        orange: 'hover:bg-orange-500/10 hover:border-orange-500/30',
    };

    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    flex items-center gap-3 p-3 border border-border rounded-lg 
                    transition-all cursor-pointer group
                    ${colorMap[color]}
                `}
            >
                <div className="text-2xl">{icon}</div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
        </Link>
    );
}

// Activity Item Component
function ActivityItem({
    company,
    status,
    time,
    color,
    emoji
}: {
    company: string;
    status: string;
    time: string;
    color: 'green' | 'blue' | 'gray';
    emoji: string;
}) {
    const colorMap = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        gray: 'bg-gray-500',
    };

    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="text-2xl">{emoji}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{company}</p>
                <p className="text-sm text-muted-foreground">{status}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${colorMap[color]}`} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
            </div>
        </div>
    );
}
