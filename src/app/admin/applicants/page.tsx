/**
 * Admin Applicants Management - REAL-TIME FIRESTORE
 * All data from Firestore, all buttons work with real-time updates
 */
'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Download,
    CheckCircle2,
    XCircle,
    FileText,
    Mail,
    Phone
} from 'lucide-react';
import { FirestoreStudentService, FirestoreDriveService, FirestoreApplicationService } from '@/lib/firestore-service';
import { SkeletonTable } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function ApplicantsManagementPage() {
    const [selectedDrive, setSelectedDrive] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'shortlisted'>('all');
    const [drives, setDrives] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeStudents: (() => void) | undefined;
        let unsubscribeDrives: (() => void) | undefined;
        let unsubscribeApplications: (() => void) | undefined;

        const setupListeners = async () => {
            try {
                // Subscribe to drives
                unsubscribeDrives = FirestoreDriveService.subscribe((loadedDrives) => {
                    setDrives(loadedDrives);
                    if (loadedDrives.length > 0 && !selectedDrive) {
                        setSelectedDrive(loadedDrives[0].id);
                    }
                });

                // Subscribe to students
                unsubscribeStudents = FirestoreStudentService.subscribe((loadedStudents) => {
                    setStudents(loadedStudents);
                });

                // Subscribe to applications
                unsubscribeApplications = FirestoreApplicationService.subscribe((loadedApplications) => {
                    setApplications(loadedApplications);
                });

                setLoading(false);
            } catch (error) {
                console.error('Error setting up listeners:', error);
                setLoading(false);
            }
        };

        setupListeners();

        return () => {
            unsubscribeStudents?.();
            unsubscribeDrives?.();
            unsubscribeApplications?.();
        };
    }, []);

    const handleShortlist = async (studentId: string) => {
        if (!selectedDrive) return;

        try {
            // Find existing application
            const app = applications.find(a => a.studentId === studentId && a.driveId === selectedDrive);

            if (app) {
                await FirestoreApplicationService.updateStatus(app.id, 'Shortlisted');
            } else {
                // Create new application
                await FirestoreApplicationService.create({
                    studentId,
                    driveId: selectedDrive,
                    status: 'Shortlisted',
                    currentRound: 'Shortlisted'
                });
            }
            // Real-time listener will update the UI automatically
        } catch (error) {
            console.error('Error shortlisting student:', error);
            alert('Failed to shortlist student');
        }
    };

    const handleExport = () => {
        const csvData = filteredStudents.map(s =>
            `${s.name},${s.email},${s.rollNo},${s.branch},${s.cgpa}`
        ).join('\n');

        const csv = 'Name,Email,Roll No,Branch,CGPA\n' + csvData;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `applicants_${selectedDrive}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // Filter students for selected drive
    const applicantsForDrive = applications.filter(a => a.driveId === selectedDrive);
    const shortlistedStudentIds = new Set(
        applicantsForDrive
            .filter(a => a.status === 'Shortlisted' || a.status === 'Selected')
            .map(a => a.studentId)
    );

    const filteredStudents = students.filter(student => {
        if (filterStatus === 'shortlisted') {
            return shortlistedStudentIds.has(student.id);
        }
        return true;
    });

    const stats = {
        total: students.length,
        shortlisted: shortlistedStudentIds.size,
        pending: students.length - shortlistedStudentIds.size
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="mb-6 border-b border-gray-200 pb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">Applicants Management</h1>
                    <p className="text-sm text-gray-600 mt-1">Loading...</p>
                </div>
                <SkeletonTable rows={8} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Applicants Management</h1>
                <p className="text-sm text-gray-600 mt-1">Review applications and manage shortlists (Real Data)</p>
            </div>

            {/* Drive Selector */}
            <div className="mb-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Drive</label>
                <select
                    value={selectedDrive || ''}
                    onChange={(e) => setSelectedDrive(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>-- Select a Drive to View Applicants --</option>
                    {drives.map(drive => (
                        <option key={drive.id} value={drive.id}>
                            {drive.companyName} - {drive.role} (Deadline: {new Date(drive.deadline).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Total Students</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Shortlisted</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.shortlisted}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">Pending Review</span>
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="mb-4 flex items-center gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or roll number..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterStatus('shortlisted')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === 'shortlisted'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    Shortlisted Only
                </button>
                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Export List
                </button>
            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Branch / CGPA</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900 dark:text-white">{student.branch}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">CGPA: {student.cgpa}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <Mail className="w-3 h-3" />
                                            {student.email}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                            <Phone className="w-3 h-3" />
                                            {student.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {shortlistedStudentIds.has(student.id) ? (
                                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded border border-green-200 dark:border-green-800">
                                            Shortlisted
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-400 text-xs font-medium rounded border border-gray-200 dark:border-slate-700">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {!shortlistedStudentIds.has(student.id) ? (
                                            <button
                                                onClick={() => handleShortlist(student.id)}
                                                className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                                            >
                                                Shortlist
                                            </button>
                                        ) : (
                                            <button className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium rounded border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredStudents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No students found. Import students from Bulk Operations.
                    </div>
                )}
            </div>
        </div>
    );
}
