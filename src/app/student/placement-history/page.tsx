/**
 * Student Placement History - REAL DATA ONLY
 * Complete placement history including rejections
 */
'use client';

import { useState, useEffect } from 'react';
import {
    Calendar,
    Building2,
    CheckCircle2,
    XCircle,
    Clock,
    FileText
} from 'lucide-react';
import { ApplicationService, DriveService, StudentService } from '@/lib/data-service';

export default function PlacementHistoryPage() {
    const [studentData, setStudentData] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [drives, setDrives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

        if (user.rollNumber) {
            // Load student info
            const students = await StudentService.getAll();
            const student = students.find(s => s.rollNo === user.rollNumber) || {
                name: user.name || 'Student',
                rollNo: user.rollNumber,
                branch: 'Not Set',
                cgpa: 0,
                email: '',
                phone: ''
            };

            // Load applications
            const apps = await ApplicationService.getAll();
            const studentApps = apps.filter(a => a.studentId === user.rollNumber);

            // Load drives
            const allDrives = await DriveService.getAll();

            // Calculate stats
            const stats = {
                totalApplications: studentApps.length,
                shortlisted: studentApps.filter(a => a.status === 'Shortlisted' || a.status === 'Selected').length,
                rejected: studentApps.filter(a => a.status === 'Rejected').length,
                inProgress: studentApps.filter(a => a.status === 'Applied').length
            };

            setStudentData({ ...student, ...stats });
            setApplications(studentApps);
            setDrives(allDrives);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-gray-600">Loading placement history...</div>
            </div>
        );
    }

    if (!studentData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-yellow-800 mb-4">Please login to view your placement history</p>
                    <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6 border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Student Portal</h1>
                        <p className="text-sm text-gray-600 mt-1">Placement Lifecycle Management System</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{studentData.rollNo}</div>
                        <div className="text-xs text-gray-500">{studentData.name} • {studentData.branch}</div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <SummaryCard
                    label="Total Applications"
                    value={studentData.totalApplications}
                    icon={FileText}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                />
                <SummaryCard
                    label="Shortlisted"
                    value={studentData.shortlisted}
                    icon={CheckCircle2}
                    color="text-green-600"
                    bgColor="bg-green-50"
                />
                <SummaryCard
                    label="Rejected"
                    value={studentData.rejected}
                    icon={XCircle}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <SummaryCard
                    label="In Progress"
                    value={studentData.inProgress}
                    icon={Clock}
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Placement History */}
            <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Complete Placement History</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Full application timeline including all outcomes (Real Data from Database)
                    </p>
                </div>

                {applications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {applications.map((app) => {
                            const drive = drives.find(d => d.id === app.driveId);
                            if (!drive) return null;

                            return <ApplicationEntry key={app.id} application={app} drive={drive} />;
                        })}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium mb-2">No Applications Yet</p>
                        <p className="text-sm mb-4">Start applying to companies to build your placement history</p>
                        <a
                            href="/student/opportunities"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Browse Opportunities
                        </a>
                    </div>
                )}
            </div>

            {/* Insights */}
            {applications.length > 0 && (
                <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress Insights</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                            <span className="text-gray-700">Shortlist Rate</span>
                            <span className="font-medium text-gray-900">
                                {studentData.totalApplications > 0
                                    ? ((studentData.shortlisted / studentData.totalApplications) * 100).toFixed(0)
                                    : 0}%
                            </span>
                        </div>
                        <div className="py-2 px-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-xs text-blue-800">
                                <strong>Tip:</strong> Keep applying to more companies to increase your chances.
                                Students with 15+ applications have 60% higher success rates.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function SummaryCard({ label, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <div className={`${bgColor} p-2 rounded`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                    <div className="text-2xl font-semibold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    );
}

function ApplicationEntry({ application, drive }: any) {
    const outcomeColors: any = {
        'Selected': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
        'Rejected': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        'Shortlisted': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        'Applied': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
        'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' }
    };

    const colors = outcomeColors[application.status] || outcomeColors['Pending'];

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors">
            {/* Company Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{drive.companyName}</h4>
                        <p className="text-sm text-gray-600">{drive.role} • ₹{drive.ctcMin}-{drive.ctcMax} LPA</p>
                    </div>
                </div>
                <div className={`px-3 py-1 ${colors.bg} ${colors.border} border rounded-full`}>
                    <span className={`text-xs font-medium ${colors.text}`}>{application.status}</span>
                </div>
            </div>

            {/* Current Stage */}
            <div className="ml-2">
                <div className="text-sm text-gray-600 mb-2">Current Round: <span className="font-medium text-gray-900">{application.currentRound || 'Applied'}</span></div>
            </div>

            {/* Applied Date */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
