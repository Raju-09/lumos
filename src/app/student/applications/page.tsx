'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Calendar,
    Building2,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Video,
    FileText,
    Award
} from 'lucide-react';

const mockApplications = [
    {
        id: '1',
        company: '🔵 Google',
        role: 'Software Engineer',
        appliedDate: '2024-01-05',
        status: 'Interview Scheduled',
        round: 'Technical Round 2',
        nextEvent: { type: 'interview', date: 'Tomorrow, 10:00 AM' },
        progress: 60,
        color: 'blue'
    },
    {
        id: '2',
        company: '🟦 Microsoft',
        role: 'SDE Intern',
        appliedDate: '2024-01-03',
        status: 'Test Completed',
        round: 'Coding Assessment',
        nextEvent: { type: 'result', date: 'Awaiting Results' },
        progress: 40,
        color: 'cyan'
    },
    {
        id: '3',
        company: '🟢 Amazon',
        role: 'Data Scientist',
        appliedDate: '2024-01-01',
        status: 'Shortlisted',
        round: 'Profile Review',
        nextEvent: { type: 'test', date: 'Jan 15, 2:00 PM' },
        progress: 30,
        color: 'green'
    },
    {
        id: '4',
        company: '🔴 Atlassian',
        role: 'Product Manager',
        appliedDate: '2023-12-28',
        status: 'Rejected',
        round: 'Application Review',
        progress: 20,
        color: 'red'
    },
];

const statusColors: any = {
    'Interview Scheduled': { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' },
    'Test Completed': { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
    'Shortlisted': { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
    'Rejected': { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20' },
    'Offer Extended': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20' },
};

export default function ApplicationsPage() {
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');

    const filteredApps = mockApplications.filter(app => {
        if (filter !== 'all' && app.status !== filter) return false;
        if (search && !app.company.toLowerCase().includes(search.toLowerCase()) &&
            !app.role.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">
                    Track your application status and upcoming events
                </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <QuickStat icon={FileText} label="Total" value="12" color="blue" />
                <QuickStat icon={Clock} label="In Progress" value="7" color="yellow" />
                <QuickStat icon={CheckCircle} label="Shortlisted" value="3" color="green" />
                <QuickStat icon={Award} label="Offers" value="1" color="purple" />
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
                <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApps.map((app, idx) => (
                    <ApplicationCard key={app.id} app={app} index={idx} />
                ))}
            </div>

            {filteredApps.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No applications found</p>
                </div>
            )}
        </div>
    );
}

function QuickStat({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: 'text-blue-500 bg-blue-500/10',
        yellow: 'text-yellow-500 bg-yellow-500/10',
        green: 'text-green-500 bg-green-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-4"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className={`w-4 h-4 ${colors[color].split(' ')[0]}`} />
                </div>
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                </div>
            </div>
        </motion.div>
    );
}

function ApplicationCard({ app, index }: any) {
    const colors = statusColors[app.status] || statusColors['Shortlisted'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 hover-lift"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="text-4xl">{app.company.split(' ')[0]}</div>
                    <div>
                        <h3 className="text-lg font-semibold">{app.company.substring(2)}</h3>
                        <p className="text-sm text-muted-foreground">{app.role}</p>
                    </div>
                </div>
                <div className={`px-3 py-1.5 ${colors.bg} ${colors.border} border rounded-full`}>
                    <span className={`text-xs font-medium ${colors.text}`}>
                        {app.status}
                    </span>
                </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Application Progress</span>
                    <span>{app.progress}%</span>
                </div>
                <div className="progress-bar">
                    <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${app.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{
                            background: app.status === 'Rejected'
                                ? 'linear-gradient(to right, #EF4444, #DC2626)'
                                : 'linear-gradient(to right, #3B82F6, #8B5CF6)'
                        }}
                    />
                </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Applied: {app.appliedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>Current: {app.round}</span>
                </div>
            </div>

            {/* Next Event */}
            {app.nextEvent && (
                <div className={`p-3 rounded-lg ${app.nextEvent.type === 'interview'
                        ? 'bg-purple-500/10 border border-purple-500/20'
                        : 'bg-blue-500/10 border border-blue-500/20'
                    }`}>
                    <div className="flex items-center gap-2 text-sm">
                        {app.nextEvent.type === 'interview' ? (
                            <Video className="w-4 h-4 text-purple-500" />
                        ) : (
                            <Clock className="w-4 h-4 text-blue-500" />
                        )}
                        <span className={app.nextEvent.type === 'interview' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}>
                            <strong>Next: </strong>{app.nextEvent.date}
                        </span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-4">
                <button className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                    View Details
                </button>
                {app.status !== 'Rejected' && (
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium">
                        Track Progress
                    </button>
                )}
            </div>
        </motion.div>
    );
}
