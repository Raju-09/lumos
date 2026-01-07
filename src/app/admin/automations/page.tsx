/**
 * Automations Hub - AI-Powered Workflow Automation
 * Smart rules and triggers with beautiful animations
 */
'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    Mail,
    Bell,
    Filter,
    Clock,
    CheckCircle2,
    Play,
    Pause,
    Settings,
    Sparkles,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';

export default function AutomationsPage() {
    const [automations, setAutomations] = useState([
        {
            id: 1,
            name: 'Auto-notify Eligible Students',
            description: 'Automatically notify students when they become eligible for new drives',
            trigger: 'New Drive Created',
            action: 'Send Email & Push Notification',
            status: 'active',
            executions: 47,
            successRate: 98
        },
        {
            id: 2,
            name: 'Application Deadline Reminder',
            description: 'Send reminders 24 hours before application deadlines',
            trigger: 'Time-based (Daily)',
            action: 'Send Reminder Notifications',
            status: 'active',
            executions: 156,
            successRate: 100
        },
        {
            id: 3,
            name: 'Status Update Notifications',
            description: 'Notify students when their application status changes',
            trigger: 'Status Changed',
            action: 'Send Status Update',
            status: 'active',
            executions: 89,
            successRate: 96
        },
        {
            id: 4,
            name: 'Weekly Placement Report',
            description: 'Generate and email weekly placement statistics to admins',
            trigger: 'Weekly (Monday 9AM)',
            action: 'Generate & Email Report',
            status: 'paused',
            executions: 12,
            successRate: 100
        }
    ]);

    const toggleAutomation = (id: number) => {
        setAutomations(prev => prev.map(auto =>
            auto.id === id
                ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' }
                : auto
        ));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Automations
                        </h1>
                        <p className="text-gray-600 text-lg">
                            AI-powered workflows to streamline placement operations
                        </p>
                    </div>
                    <GradientButton variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                        Create Automation
                    </GradientButton>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard
                        icon={Zap}
                        label="Active Automations"
                        value={automations.filter(a => a.status === 'active').length}
                        gradient="from-yellow-500 to-orange-500"
                        delay={0.1}
                    />
                    <StatsCard
                        icon={TrendingUp}
                        label="Total Executions"
                        value={automations.reduce((sum, a) => sum + a.executions, 0)}
                        gradient="from-blue-500 to-cyan-500"
                        delay={0.2}
                    />
                    <StatsCard
                        icon={CheckCircle2}
                        label="Success Rate"
                        value="98%"
                        gradient="from-green-500 to-emerald-500"
                        delay={0.3}
                    />
                    <StatsCard
                        icon={Clock}
                        label="Time Saved"
                        value="42 hrs"
                        gradient="from-purple-500 to-pink-500"
                        delay={0.4}
                    />
                </div>

                {/* Automation Templates */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-6 h-6" />
                        <h2 className="text-2xl font-bold">AI Suggestions</h2>
                    </div>
                    <p className="text-white/90 mb-6">
                        Based on your placement patterns, we recommend setting up these automations:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SuggestionCard
                            title="Smart Matching"
                            description="Auto-match students with suitable drives based on skills"
                        />
                        <SuggestionCard
                            title="Interview Scheduler"
                            description="Automatically schedule interviews when students are shortlisted"
                        />
                        <SuggestionCard
                            title="Performance Alerts"
                            description="Get notified when placement rates drop below targets"
                        />
                    </div>
                </motion.div>

                {/* Active Automations List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Your Automations</h2>
                    {automations.map((auto, idx) => (
                        <AutomationCard
                            key={auto.id}
                            automation={auto}
                            index={idx}
                            onToggle={() => toggleAutomation(auto.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatsCard({ icon: Icon, label, value, gradient, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-xl"
        >
            <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-xl mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </motion.div>
    );
}

function SuggestionCard({ title, description }: any) {
    return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
        </div>
    );
}

function AutomationCard({ automation, index, onToggle }: any) {
    const isActive = automation.status === 'active';

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all"
        >
            <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Zap className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{automation.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                                }`}>
                                {automation.status}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4">{automation.description}</p>

                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Filter className="w-4 h-4" />
                                <span>Trigger: <strong>{automation.trigger}</strong></span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <Bell className="w-4 h-4" />
                                <span>Action: <strong>{automation.action}</strong></span>
                            </div>
                        </div>

                        <div className="flex gap-6 mt-4 text-sm text-gray-600">
                            <span>{automation.executions} executions</span>
                            <span className="text-green-600 font-medium">{automation.successRate}% success</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onToggle}
                        className={`p-2 rounded-lg transition-all ${isActive
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
