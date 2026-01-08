/**
 * Admin Layout - COMPLETE Navigation
 * All management features accessible
 */
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Upload, Zap, LogOut, Landmark, Settings, LineChart } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Notifications } from '@/components/notifications';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('lumos_user');
        window.location.href = '/login';
    };

    const navItems = [
        { href: '/admin/institutional', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/drives', label: 'Drives', icon: Building2 },
        { href: '/admin/applicants', label: 'Applicants', icon: Users },
        { href: '/admin/bulk-operations', label: 'Bulk Operations', icon: Upload },
        { href: '/admin/automations', label: 'Automations', icon: Zap },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 transition-colors duration-300">
            {/* Top Header */}
            <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Landmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">Placement Cell Portal</h1>
                            <p className="text-sm text-gray-400">Administrative Management System</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Notifications />
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
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
