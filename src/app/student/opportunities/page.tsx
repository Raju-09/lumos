/**
 * Student Opportunities Page - FIRESTORE EDITION
 * Real-time drives from Firebase with Apply functionality
 */
'use client';

import { motion } from 'framer-motion';
import {
    Building2,
    DollarSign,
    MapPin,
    CheckCircle2,
    XCircle,
    Briefcase,
    Calendar,
    Search,
    TrendingUp,
    Clock,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { FirestoreDriveService, FirestoreApplicationService } from '@/lib/firestore-service';
import { getAccessLevel } from '@/lib/access-control';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast-provider';

export default function OpportunitiesPage() {
    const [filter, setFilter] = useState<'all' | 'eligible' | 'applied'>('all');
    const [search, setSearch] = useState('');
    const [drives, setDrives] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [accessDenied, setAccessDenied] = useState(false);
    const [applyingTo, setApplyingTo] = useState<string | null>(null);
    const { showToast } = useToast();
    const [stats, setStats] = useState({
        totalDrives: 0,
        eligible: 0,
        applied: 0,
        avgPackage: 0
    });

    useEffect(() => {
        let unsubscribeAuth: (() => void) | undefined;

        // Use the auth wrapper from firestore-service for consistent auth handling
        import('@/lib/firestore-service').then(({ onAuthChange }) => {
            unsubscribeAuth = onAuthChange(async (user) => {
                if (user) {
                    console.log('[Opportunities] User authenticated:', user.email);
                    loadData();
                } else {
                    console.log('[Opportunities] Not authenticated');
                    setLoading(false);
                }
            });
        });

        return () => {
            unsubscribeAuth?.();
        };
    }, []);

    const loadData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

            // Year-based access check
            if (user.academicYear) {
                const access = getAccessLevel(user.academicYear);
                if (!access.canViewPlacements) {
                    setAccessDenied(true);
                    setLoading(false);
                    return;
                }
            }

            if (!user.rollNumber && !user.email) {
                setLoading(false);
                return;
            }

            // Create student data from user profile
            const studentData = {
                id: user.uid || user.rollNumber,
                rollNo: user.rollNumber || user.email,
                name: user.name,
                email: user.email,
                cgpa: user.cgpa || 8.5, // Default for demo
                branch: user.branch || 'CSE', // Default for demo
                backlogs: user.backlogs || 0,
                academicYear: user.academicYear || 4
            };
            setStudent(studentData);

            // Load drives from Firestore
            const allDrives = await FirestoreDriveService.getAll();

            // Load student applications from Firestore
            const allApps = await FirestoreApplicationService.getAll();
            const studentApps = allApps.filter(a =>
                a.studentId === user.rollNumber || a.studentId === user.email || a.studentId === user.uid
            );
            setApplications(studentApps);

            // Calculate eligibility and stats
            let eligibleCount = 0;
            let totalPackage = 0;
            const appliedDriveIds = new Set(studentApps.map(a => a.driveId));

            const enrichedDrives = allDrives.map(drive => {
                // Check eligibility
                let isEligible = true;
                if (drive.eligibility) {
                    const cgpaCheck = (studentData.cgpa || 0) >= (drive.eligibility.cgpaCutoff || 0);
                    const branchCheck = !drive.eligibility.allowedBranches?.length ||
                        drive.eligibility.allowedBranches.includes(studentData.branch);
                    isEligible = cgpaCheck && branchCheck;
                }

                if (isEligible) eligibleCount++;
                totalPackage += drive.ctcMax || 0;

                return {
                    ...drive,
                    eligible: isEligible,
                    applied: appliedDriveIds.has(drive.id)
                };
            });

            setDrives(enrichedDrives);
            setStats({
                totalDrives: allDrives.length,
                eligible: eligibleCount,
                applied: studentApps.length,
                avgPackage: allDrives.length > 0 ? Math.round(totalPackage / allDrives.length) : 0
            });

        } catch (error) {
            console.error('Error loading opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (driveId: string, companyName: string) => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

        setApplyingTo(driveId);

        try {
            // Create application in Firestore
            await FirestoreApplicationService.create({
                studentId: user.rollNumber || user.email || user.uid,
                driveId,
                status: 'Applied',
                currentRound: 'Resume Screening',
            });

            // Update local state immediately
            setDrives(prev => prev.map(d =>
                d.id === driveId ? { ...d, applied: true } : d
            ));
            setStats(prev => ({ ...prev, applied: prev.applied + 1 }));

            // Show success toast
            showToast('success', `Successfully applied to ${companyName}! 🎉`);

        } catch (error) {
            console.error('Error applying:', error);
            showToast('error', 'Failed to apply. Please try again.');
        } finally {
            setApplyingTo(null);
        }
    };

    const filteredDrives = drives.filter(drive => {
        if (filter === 'eligible' && !drive.eligible) return false;
        if (filter === 'applied' && !drive.applied) return false;
        if (search &&
            !drive.companyName?.toLowerCase().includes(search.toLowerCase()) &&
            !drive.role?.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading opportunities...
                </div>
            </div>
        );
    }

    if (accessDenied) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement Drives Locked</h2>
                    <p className="text-gray-600 mb-6">
                        Campus placement drives are available for 3rd and 4th year students.
                        As an early-year student, focus on building your skills and applying for internships!
                    </p>
                    <Link
                        href="/student/internships"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Explore Internships <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 space-y-6 transition-colors">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Campus Placement Drives</h1>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Browse and apply to drives you're eligible for
                </p>
            </motion.div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatBox icon={Briefcase} label="Total Drives" value={stats.totalDrives} color="blue" />
                <StatBox icon={CheckCircle2} label="Eligible" value={stats.eligible} color="green" />
                <StatBox icon={Clock} label="Applied" value={stats.applied} color="yellow" />
                <StatBox icon={TrendingUp} label="Avg Package" value={`${stats.avgPackage} LPA`} color="purple" />
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search companies or roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-2">
                    <FilterButton
                        active={filter === 'all'}
                        onClick={() => setFilter('all')}
                        label="All"
                    />
                    <FilterButton
                        active={filter === 'eligible'}
                        onClick={() => setFilter('eligible')}
                        label="Eligible Only"
                    />
                    <FilterButton
                        active={filter === 'applied'}
                        onClick={() => setFilter('applied')}
                        label="Applied"
                    />
                </div>
            </div>

            {/* Drives Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredDrives.map((drive, idx) => (
                    <DriveCard
                        key={drive.id}
                        drive={drive}
                        index={idx}
                        onApply={() => handleApply(drive.id, drive.companyName)}
                        isApplying={applyingTo === drive.id}
                    />
                ))}
            </div>

            {filteredDrives.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                        {stats.totalDrives === 0
                            ? "No placement drives available yet."
                            : "No drives found matching your criteria"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        New drives will appear here when the placement cell adds them.
                    </p>
                </div>
            )}
        </div>
    );
}

function StatBox({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
        green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
        yellow: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
    };

    const c = colors[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-4 shadow-sm"
        >
            <div className={`p-3 rounded-lg ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.text}`} />
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
            </div>
        </motion.div>
    );
}

function FilterButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${active
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
        >
            {label}
        </button>
    );
}

function DriveCard({ drive, index, onApply, isApplying }: any) {
    const [showModal, setShowModal] = useState(false);

    // Priority: Applied > Eligible > Not Eligible
    // If applied, always show as applied regardless of eligibility
    const showEligibilityWarning = !drive.eligible && !drive.applied && drive.eligibility;
    // If applied, consider it eligible for display purposes (they already applied)
    const isEligibleOrApplied = drive.applied || drive.eligible;

    const deadline = new Date(drive.deadline);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const isUrgent = daysLeft <= 2;

    const locationDisplay = Array.isArray(drive.location)
        ? drive.location.join(', ')
        : (drive.location || 'Multiple');

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 group"
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-2xl border border-gray-100 dark:border-slate-700">
                            {drive.logo || '🏢'}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {drive.companyName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{drive.role}</p>
                        </div>
                    </div>
                    {/* Show Eligible badge if eligible, OR if applied (implying past eligibility) */}
                    <EligibilityBadge eligible={isEligibleOrApplied} applied={drive.applied} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <DetailItem
                        icon={DollarSign}
                        label="Package"
                        value={`₹${drive.ctcMin}-${drive.ctcMax} LPA`}
                    />
                    <DetailItem icon={MapPin} label="Location" value={locationDisplay} />
                    <DetailItem icon={Briefcase} label="Type" value={drive.type} />
                    <DetailItem
                        icon={Calendar}
                        label="Deadline"
                        value={daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}
                        urgent={isUrgent}
                    />
                </div>

                {/* Eligibility Breakdown - Only show if NOT eligible AND NOT applied */}
                {showEligibilityWarning && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg">
                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                            Eligibility Criteria Not Met:
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">
                            Requires CGPA {drive.eligibility.cgpaCutoff}+ |
                            Branches: {drive.eligibility.allowedBranches?.join(', ') || 'All'}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300 text-sm font-medium"
                    >
                        View Details
                    </button>
                    {drive.applied ? (
                        <button
                            disabled
                            className="flex-1 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Applied
                        </button>
                    ) : (
                        <button
                            onClick={onApply}
                            disabled={!drive.eligible || isApplying}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${drive.eligible
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            {isApplying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Applying...
                                </>
                            ) : drive.eligible ? (
                                'Apply Now'
                            ) : (
                                'Not Eligible'
                            )}
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-0" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start bg-gray-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-3xl border border-gray-200 dark:border-slate-700">
                                    {drive.logo || '🏢'}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{drive.role}</h2>
                                    <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{drive.companyName}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1.5">Package</div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">₹{drive.ctcMin}-{drive.ctcMax} LPA</div>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-900/30">
                                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1.5">Type</div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{drive.type}</div>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                    <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1.5">Location</div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white truncate" title={locationDisplay}>{locationDisplay}</div>
                                </div>
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                                    <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1.5">Deadline</div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-white">{daysLeft} Days</div>
                                </div>
                            </div>

                            {/* Eligibility Info */}
                            {drive.eligibility && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Eligibility Criteria</h4>
                                    <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">CGPA:</span>
                                            <span>{drive.eligibility.cgpaCutoff || 'N/A'}+</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Branches:</span>
                                            <span>{drive.eligibility.allowedBranches?.join(', ') || 'All'}</span>
                                        </div>
                                        {drive.eligibility.maxBacklogs !== undefined && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Max Backlogs:</span>
                                                <span>{drive.eligibility.maxBacklogs}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Job Description */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Job Description</h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
                                        {drive.description || drive.jobDescription || 'No description provided. Please contact the placement cell for more details.'}
                                    </p>
                                </div>
                            </div>

                            {/* Requirements */}
                            {(drive.requirements && drive.requirements.length > 0) && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Requirements</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-base">
                                        {drive.requirements.map((req: string, i: number) => (
                                            <li key={i} className="leading-relaxed">{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills/Technologies */}
                            {(drive.skills || drive.technologies) && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Skills & Technologies</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {(drive.skills || drive.technologies || []).map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-800">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:underline">
                                Close
                            </button>
                            {drive.applied ? (
                                <button disabled className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
                                    Already Applied
                                </button>
                            ) : (
                                <button
                                    onClick={() => { onApply(); setShowModal(false); }}
                                    disabled={!drive.eligible}
                                    className={`px-8 py-2.5 rounded-lg font-medium text-white shadow-lg shadow-blue-500/20 transform transition-all ${drive.eligible ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {drive.eligible ? 'Apply for Role' : 'Not Eligible'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function EligibilityBadge({ eligible, applied }: { eligible: boolean, applied?: boolean }) {
    // Priority: Applied (Success) > Eligible (Success) > Not Eligible (Error)
    if (applied) {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Applied
                </span>
            </div>
        );
    }

    if (eligible) {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Eligible
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full">
            <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-700 dark:text-red-300">
                Not Eligible
            </span>
        </div>
    );
}

function DetailItem({ icon: Icon, label, value, urgent }: any) {
    return (
        <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${urgent ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
            <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                <div className={`text-sm font-medium ${urgent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {value}
                </div>
            </div>
        </div>
    );
}
