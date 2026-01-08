/**
 * Student Layout - COMPLETE Navigation
 * All features accessible and properly linked
 */
'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, Globe, FileText, TrendingUp, User, LogOut, Settings, ChevronDown, Building2, GraduationCap, LayoutDashboard, Search, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Notifications } from '@/components/notifications';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('lumos_user');
        if (user) {
            setUserData(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('lumos_user');
        window.location.href = '/login';
    };

    // Dynamic nav items based on academic year (hide Live Jobs for 1st/2nd year)
    const isJunior = userData?.academicYear && (userData.academicYear === 1 || userData.academicYear === 2);

    const navItems = [
        { href: '/student/internships', label: 'Internships', icon: Briefcase },
        { href: '/student/opportunities', label: 'Campus Drives', icon: Building2 },
        // Only show Live Jobs for 3rd/4th year students
        ...(!isJunior ? [{ href: '/student/jobs', label: 'Live Jobs', icon: Globe }] : []),
        { href: '/student/resume-builder', label: 'Resume Builder', icon: FileText },
        { href: '/student/ats-checker', label: 'ATS Checker', icon: TrendingUp },
        { href: '/student/placement-history', label: 'My Applications', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
            {/* Top Header */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Student Portal</h1>
                            <p className="text-sm text-gray-400">Campus Placement Management System</p>
                        </div>
                    </div>

                    {/* Right Side: Theme Toggle & Profile */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden border-2 border-primary/20">
                                    {userData?.avatar ? (
                                        <img src={userData.avatar} alt={userData?.name || 'User'} className="w-full h-full object-cover" />
                                    ) : (
                                        userData?.name?.charAt(0)?.toUpperCase() || 'U'
                                    )}
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-white">
                                        {userData?.name || 'User'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {userData?.email || 'student@college.edu'}
                                    </div>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileMenu && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileMenu(false)}
                                    />

                                    {/* Menu */}
                                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-lg shadow-xl border border-slate-800 py-2 z-20">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-slate-800">
                                            <div className="font-medium text-white">{userData?.name || 'User'}</div>
                                            <div className="text-sm text-gray-400">{userData?.email || 'student@college.edu'}</div>
                                            {userData?.rollNumber && (
                                                <div className="text-xs text-gray-500 mt-1">Roll: {userData.rollNumber}</div>
                                            )}
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    window.location.href = '/student/profile';
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-800 flex items-center gap-3"
                                            >
                                                <User className="w-4 h-4" />
                                                My Profile
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    window.location.href = '/student/settings';
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-slate-800 flex items-center gap-3"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-slate-800 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-3"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="px-6">
                    <div className="flex gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${isActive
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-gray-400 hover:text-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
