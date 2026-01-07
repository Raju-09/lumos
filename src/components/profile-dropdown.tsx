'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
    User,
    Settings,
    Bell,
    LogOut,
    Trash2,
    Shield,
    ChevronDown,
    Activity,
    Database,
    AlertTriangle
} from 'lucide-react';

export function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        if (userData.avatar) {
            setProfileImage(userData.avatar);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setShowDeleteConfirm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDeleteAccount = async () => {
        // TODO: Implement actual API call
        console.log('Deleting account...');
        // For now, just logout
        logout();
        router.push('/');
    };

    const getInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold overflow-hidden border-2 border-primary/20">
                    {profileImage ? (
                        <img src={profileImage} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        getInitials()
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{user?.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role || 'student'}</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                    >
                        {/* User Info */}
                        <div className="p-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border-b border-border">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg overflow-hidden border-2 border-primary/20">
                                    {profileImage ? (
                                        <img src={profileImage} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        getInitials()
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate">{user?.name || 'User'}</div>
                                    <div className="text-xs text-muted-foreground truncate">{user?.email || 'user@college.edu'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <div className="px-2 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 capitalize">
                                    {user?.role || 'student'}
                                </div>
                                <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    <span>Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <MenuItem
                                icon={User}
                                label="View Profile"
                                href="/student/profile"
                                onClick={() => setIsOpen(false)}
                            />
                            <MenuItem
                                icon={Activity}
                                label="Activity Tracker"
                                href="/student/activity"
                                onClick={() => setIsOpen(false)}
                            />
                            <MenuItem
                                icon={Settings}
                                label="Settings"
                                href="/student/settings"
                                onClick={() => setIsOpen(false)}
                            />
                            <MenuItem
                                icon={Bell}
                                label="Notifications"
                                href="/student/notifications"
                                onClick={() => setIsOpen(false)}
                                badge={3}
                            />
                            <MenuItem
                                icon={Shield}
                                label="Privacy & Security"
                                href="/student/privacy"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>

                        {/* Danger Zone */}
                        <div className="p-2 border-t border-border">
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Delete Account</span>
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    router.push('/');
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setShowDeleteConfirm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl p-6 z-50 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Delete Account</h3>
                                    <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Deleting your account will:
                                    </p>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                        <li className="flex items-center gap-2">
                                            <Database className="w-3 h-3 text-red-500" />
                                            Permanently delete all your personal data
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Trash2 className="w-3 h-3 text-red-500" />
                                            Remove all application records
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <AlertTriangle className="w-3 h-3 text-red-500" />
                                            Cancel all pending applications
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-sm text-muted-foreground">
                                    Type <strong className="text-foreground">DELETE</strong> to confirm
                                </p>
                                <input
                                    type="text"
                                    placeholder="Type DELETE"
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    id="delete-confirm-input"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const input = document.getElementById('delete-confirm-input') as HTMLInputElement;
                                        if (input?.value === 'DELETE') {
                                            handleDeleteAccount();
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete Forever
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function MenuItem({ icon: Icon, label, href, onClick, badge }: any) {
    return (
        <Link href={href} onClick={onClick}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors group">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                <span className="text-sm font-medium flex-1">{label}</span>
                {badge && (
                    <div className="w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                        {badge}
                    </div>
                )}
            </div>
        </Link>
    );
}
