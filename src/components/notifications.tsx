'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        title: 'Interview Scheduled',
        message: 'Your interview for Software Engineer at TechCorp is scheduled for tomorrow at 10 AM.',
        time: '2 hours ago',
        read: false,
        type: 'info'
    },
    {
        id: '2',
        title: 'Application Shortlisted',
        message: 'Congratulations! Your application for SDE Intern has been shortlisted.',
        time: '1 day ago',
        read: false,
        type: 'success'
    },
    {
        id: '3',
        title: 'Profile Incomplete',
        message: 'Please update your skills section to improve visibility.',
        time: '2 days ago',
        read: true,
        type: 'warning'
    }
];

export function Notifications() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'
                                                        }`} />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex justify-between items-start">
                                                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                                                }`}>
                                                                {notification.title}
                                                            </p>
                                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
