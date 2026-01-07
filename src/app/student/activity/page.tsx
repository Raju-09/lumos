'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Activity,
    Eye,
    MousePointer,
    Clock,
    CheckCircle2,
    Send,
    Download,
    Calendar,
    TrendingUp,
    BarChart3
} from 'lucide-react';

interface ActivityEvent {
    id: string;
    type: 'view' | 'click' | 'submit' | 'download';
    action: string;
    timestamp: Date;
    metadata?: any;
}

export default function ActivityTrackerPage() {
    const [activities, setActivities] = useState<ActivityEvent[]>([]);
    const [stats, setStats] = useState({
        totalActions: 0,
        applicationsSubmitted: 0,
        profileViews: 0,
        timeSpent: 0 // in minutes
    });

    useEffect(() => {
        // Track page view
        trackActivity('view', 'Viewed Activity Tracker');

        // Load activities from localStorage
        loadActivities();

        // Calculate session time
        const startTime = Date.now();
        return () => {
            const sessionTime = Math.floor((Date.now() - startTime) / 60000);
            updateTimeSpent(sessionTime);
        };
    }, []);

    const loadActivities = () => {
        const stored = localStorage.getItem('lumos_activities');
        if (stored) {
            const parsed = JSON.parse(stored);
            setActivities(parsed.map((a: any) => ({
                ...a,
                timestamp: new Date(a.timestamp)
            })));
            calculateStats(parsed);
        }
    };

    const trackActivity = (type: ActivityEvent['type'], action: string, metadata?: any) => {
        const event: ActivityEvent = {
            id: `activity_${Date.now()}`,
            type,
            action,
            timestamp: new Date(),
            metadata
        };

        const newActivities = [event, ...activities].slice(0, 100); // Keep last 100
        setActivities(newActivities);
        localStorage.setItem('lumos_activities', JSON.stringify(newActivities));
        calculateStats(newActivities);
    };

    const calculateStats = (acts: ActivityEvent[]) => {
        setStats({
            totalActions: acts.length,
            applicationsSubmitted: acts.filter(a => a.type === 'submit').length,
            profileViews: acts.filter(a => a.action.includes('Profile')).length,
            timeSpent: parseInt(localStorage.getItem('lumos_time_spent') || '0')
        });
    };

    const updateTimeSpent = (minutes: number) => {
        const current = parseInt(localStorage.getItem('lumos_time_spent') || '0');
        localStorage.setItem('lumos_time_spent', String(current + minutes));
    };

    const todayActivities = activities.filter(a => {
        const today = new Date();
        const actDate = new Date(a.timestamp);
        return actDate.toDateString() === today.toDateString();
    });

    const thisWeekActivities = activities.filter(a => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return new Date(a.timestamp).getTime() > weekAgo;
    });

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="p-3 bg-primary/10 rounded-lg">
                    <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Activity Tracker</h1>
                    <p className="text-muted-foreground">
                        Monitor your placement activity in real-time
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live Tracking</span>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={MousePointer}
                    label="Total Actions"
                    value={stats.totalActions.toString()}
                    color="blue"
                />
                <StatCard
                    icon={Send}
                    label="Applications"
                    value={stats.applicationsSubmitted.toString()}
                    color="green"
                />
                <StatCard
                    icon={Eye}
                    label="Profile Views"
                    value={stats.profileViews.toString()}
                    color="purple"
                />
                <StatCard
                    icon={Clock}
                    label="Time Spent"
                    value={`${stats.timeSpent}m`}
                    color="yellow"
                />
            </div>

            {/* Activity Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Activity Over Time</h3>
                <div className="h-64 flex items-end gap-2">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const dayAgo = 6 - i;
                        const date = new Date(Date.now() - dayAgo * 24 * 60 * 60 * 1000);
                        const dayActivities = activities.filter(a =>
                            new Date(a.timestamp).toDateString() === date.toDateString()
                        ).length;
                        const maxHeight = Math.max(...Array.from({ length: 7 }).map((_, j) => {
                            const d = new Date(Date.now() - (6 - j) * 24 * 60 * 60 * 1000);
                            return activities.filter(a =>
                                new Date(a.timestamp).toDateString() === d.toDateString()
                            ).length;
                        }));

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-primary/10 rounded-t-lg relative" style={{
                                    height: `${maxHeight > 0 ? (dayActivities / maxHeight) * 100 : 0}%`,
                                    minHeight: dayActivities > 0 ? '20px' : '0'
                                }}>
                                    {dayActivities > 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary to-secondary rounded-t-lg flex items-center justify-center text-xs text-white font-medium">
                                            {dayActivities}
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {todayActivities.length > 0 ? (
                            todayActivities.map((activity, idx) => (
                                <ActivityItem key={activity.id} activity={activity} index={idx} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                No activity today yet
                            </p>
                        )}
                    </div>
                </div>

                {/* This Week */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">This Week</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {thisWeekActivities.slice(0, 10).map((activity, idx) => (
                            <ActivityItem key={activity.id} activity={activity} index={idx} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: 'text-blue-500 bg-blue-500/10',
        green: 'text-green-500 bg-green-500/10',
        purple: 'text-purple-500 bg-purple-500/10',
        yellow: 'text-yellow-500 bg-yellow-500/10',
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
        >
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                <Icon className={`w-5 h-5 ${colors[color].split(' ')[0]}`} />
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
            </div>
        </motion.div>
    );
}

function ActivityItem({ activity, index }: { activity: ActivityEvent; index: number }) {
    const typeConfig: any = {
        view: { icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
        click: { icon: MousePointer, color: 'text-purple-500 bg-purple-500/10' },
        submit: { icon: Send, color: 'text-green-500 bg-green-500/10' },
        download: { icon: Download, color: 'text-yellow-500 bg-yellow-500/10' },
    };

    const config = typeConfig[activity.type];
    const Icon = config.icon;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors"
        >
            <div className={`p-2 rounded-lg ${config.color}`}>
                <Icon className={`w-4 h-4 ${config.color.split(' ')[0]}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
            </div>
        </motion.div>
    );
}
