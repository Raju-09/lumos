/**
 * Recruiter Layout - Simplified Navigation
 * For external recruiters to manage their campus drives
 */
'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, LogOut, Building2, Briefcase } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Notifications } from '@/components/notifications';

export default function RecruiterLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex flex-col font-[family-name:var(--font-outfit)]">
            <header className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-none">Recruiter Portal</h1>
                            <p className="text-xs text-gray-400">Campus Hiring Platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white">TechCorp Inc.</p>
                            <p className="text-xs text-gray-400">recruiter@techcorp.com</p>
                        </div>
                        <Notifications />
                        <ThemeToggle />
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Sub-navigation */}
                <div className="border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-6">
                        <nav className="flex gap-6">
                            <Link href="/recruiter/dashboard" className={`px-1 py-3 text-sm font-medium ${pathname === '/recruiter/dashboard' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white transition-colors'}`}>
                                <LayoutDashboard className="w-4 h-4 inline mr-2" />
                                Dashboard
                            </Link>
                            <Link href="/recruiter/drives" className={`px-1 py-3 text-sm font-medium ${pathname.startsWith('/recruiter/drives') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white transition-colors'}`}>
                                <Briefcase className="w-4 h-4 inline mr-2" />
                                My Drives
                            </Link>
                            <Link href="/recruiter/candidates" className={`px-1 py-3 text-sm font-medium ${pathname.startsWith('/recruiter/candidates') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-400 hover:text-white transition-colors'}`}>
                                <Users className="w-4 h-4 inline mr-2" />
                                Candidates
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
