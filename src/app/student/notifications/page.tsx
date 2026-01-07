'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Bell,
    Mail,
    MessageSquare,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Info,
    Trash2,
    Check,
    Filter
} from 'lucide-react';

const mockNotifications = [
    {
        id: 'n1',
        type: 'success',
        title: 'Application Shortlisted',
        message: 'You have been shortlisted for Google Software Engineer role',
        company: 'Google',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false
    },
    {
        id: 'n2',
        type: 'info',
        title: 'Test Scheduled',
        message: 'Microsoft coding assessment scheduled for Tomorrow at 10:00 AM',
        company: 'Microsoft',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: false
    },
    {
        id: 'n3',
        type: 'warning',
        title: 'Application Deadline Soon',
        message: 'Amazon Data Scientist drive closes in 2 days',
        company: 'Amazon',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true
    },
    {
        id: 'n4',
        type: 'error',
        title: 'Application Rejected',
        message: 'Your application for Atlassian PM role was not successful',
        company: 'Atlassian',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
        read: true
    },
    {
        id: 'n5',
        type: 'info',
        title: 'New Drive Posted',
        message: 'Goldman Sachs has posted a new Analyst role - Check eligibility',
        company: 'Goldman Sachs',
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
        read: true
    }
];

export default function NotificationsPage() {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [notifications, setNotifications] = useState(mockNotifications);

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                    <p className="text-muted-foreground">
                        {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </motion.div>

            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-card border border-border hover:bg-muted'
                        }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread'
                            ? 'bg-primary text-white'
                            : 'bg-card border border-border hover:bg-muted'
                        }`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.map((notification, idx) => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                        index={idx}
                        onMarkAsRead={() => markAsRead(notification.id)}
                        onDelete={() => deleteNotification(notification.id)}
                    />
                ))}
            </div>

            {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
                    </p>
                </div>
            )}
        </div>
    );
}

function NotificationCard({ notification, index, onMarkAsRead, onDelete }: any) {
    const typeConfig: any = {
        success: {
            icon: CheckCircle2,
            bg: 'bg-green-500/10',
            text: 'text-green-500',
            border: 'border-green-500/20'
        },
        info: {
            icon: Info,
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            border: 'border-blue-500/20'
        },
        warning: {
            icon: AlertCircle,
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-500',
            border: 'border-yellow-500/20'
        },
        error: {
            icon: XCircle,
            bg: 'bg-red-500/10',
            text: 'text-red-500',
            border: 'border-red-500/20'
        }
    };

    const config = typeConfig[notification.type];
    const Icon = config.icon;

    const formatTime = (date: Date) => {
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-lg border transition-all ${notification.read
                    ? 'bg-card border-border'
                    : 'bg-primary/5 border-primary/20'
                }`}
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{notification.company}</span>
                        <span>•</span>
                        <span>{formatTime(notification.timestamp)}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {!notification.read && (
                        <button
                            onClick={onMarkAsRead}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                            title="Mark as read"
                        >
                            <Check className="w-4 h-4 text-muted-foreground" />
                        </button>
                    )}
                    <button
                        onClick={onDelete}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
