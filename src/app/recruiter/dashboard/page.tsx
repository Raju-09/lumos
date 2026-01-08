'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    Building2,
    Users,
    FileDown,
    Search,
    Filter,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Mail,
    Phone,
    Globe,
    Award,
    Download,
    PieChart as PieChartIcon,
    ArrowUpRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const mockRecruiterData = {
    company: 'Google',
    logo: 'G',
    hr: {
        name: 'Sarah Johnson',
        email: 'sarah.j@google.com',
        phone: '+91 98765 43210'
    },
    activeDrives: [
        {
            id: 'd1',
            role: 'Software Engineer',
            type: 'Full-Time',
            applicants: 45,
            shortlisted: 12,
            selected: 5,
            deadline: '2024-02-15',
            status: 'Active'
        },
        {
            id: 'd2',
            role: 'SDE Intern',
            type: 'Internship',
            applicants: 30,
            shortlisted: 8,
            selected: 0,
            deadline: '2024-02-20',
            status: 'Active'
        }
    ]
};

const applicationTrends = [
    { day: 'Mon', applicants: 12 },
    { day: 'Tue', applicants: 18 },
    { day: 'Wed', applicants: 15 },
    { day: 'Thu', applicants: 25 },
    { day: 'Fri', applicants: 32 },
    { day: 'Sat', applicants: 10 },
    { day: 'Sun', applicants: 5 },
];

const statusDistribution = [
    { name: 'Applied', value: 45, color: '#3B82F6' },
    { name: 'Shortlisted', value: 20, color: '#8B5CF6' },
    { name: 'Interviewing', value: 15, color: '#F59E0B' },
    { name: 'Selected', value: 5, color: '#10B981' },
    { name: 'Rejected', value: 10, color: '#EF4444' },
];

const mockStudents = [
    {
        id: '1',
        name: 'Arjun Kumar',
        rollNo: '20CS1001',
        branch: 'CSE',
        cgpa: 8.5,
        email: 'arjun@college.edu',
        phone: '+91 98765 11111',
        skills: ['React', 'Node.js', 'Python'],
        resume: 'resume_arjun.pdf',
        status: 'Shortlisted'
    },
    {
        id: '2',
        name: 'Priya Sharma',
        rollNo: '20CS1002',
        branch: 'CSE',
        cgpa: 9.2,
        email: 'priya@college.edu',
        phone: '+91 98765 22222',
        skills: ['Java', 'Spring', 'AWS'],
        resume: 'resume_priya.pdf',
        status: 'Applied'
    },
    {
        id: '3',
        name: 'Rahul Verma',
        rollNo: '20CS1003',
        branch: 'CSE',
        cgpa: 8.8,
        email: 'rahul@college.edu',
        phone: '+91 98765 33333',
        skills: ['Python', 'ML', 'TensorFlow'],
        resume: 'resume_rahul.pdf',
        status: 'Selected'
    }
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-3 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function RecruiterDashboard() {
    const [search, setSearch] = useState('');
    const [selectedDrive, setSelectedDrive] = useState(mockRecruiterData.activeDrives[0]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        status: 'all',
        minCGPA: 0,
        branch: 'all'
    });

    const filteredStudents = mockStudents.filter(student => {
        // Search filter
        if (search && !student.name.toLowerCase().includes(search.toLowerCase()) &&
            !student.rollNo.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
        // Status filter
        if (filters.status !== 'all' && student.status !== filters.status) {
            return false;
        }
        // CGPA filter
        if (filters.minCGPA > 0 && student.cgpa < filters.minCGPA) {
            return false;
        }
        // Branch filter
        if (filters.branch !== 'all' && student.branch !== filters.branch) {
            return false;
        }
        return true;
    });

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex items-center justify-center text-3xl font-bold text-blue-600 dark:text-blue-500 shadow-sm">
                        {mockRecruiterData.logo}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">Welcome, {mockRecruiterData.company}</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage your campus drives and view candidates</p>
                    </div>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Recruiter Contact</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                        {(() => {
                            const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('lumos_user') || '{}') : {};
                            return user.name || 'Recruiter';
                        })()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {(() => {
                            const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('lumos_user') || '{}') : {};
                            return user.email || 'recruiter@company.com';
                        })()}
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Award}
                    label="Active Drives"
                    value={mockRecruiterData.activeDrives.length.toString()}
                    color="blue"
                />
                <StatCard
                    icon={Users}
                    label="Total Applications"
                    value="75"
                    color="green"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Shortlisted"
                    value="20"
                    color="purple"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Selected"
                    value="5"
                    color="yellow"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Students List */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Application Trend */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Velocity</h3>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={applicationTrends}>
                                        <defs>
                                            <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                                        <XAxis dataKey="day" axisLine={false} tickLine={false} stroke="#9ca3af" fontSize={12} dy={10} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="applicants" stroke="#3B82F6" fillOpacity={1} fill="url(#colorApplicants)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Status Distribution */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pipeline Status</h3>
                            <div className="h-[200px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Students List */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Candidates for {selectedDrive.role}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {filteredStudents.length} students found
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowFilterModal(true)}
                                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filter</span>
                                </button>
                                <button
                                    onClick={() => {
                                        // Export to CSV
                                        const csvContent = [
                                            ['Name', 'Roll No', 'Branch', 'CGPA', 'Email', 'Status'].join(','),
                                            ...filteredStudents.map(s =>
                                                [s.name, s.rollNo, s.branch, s.cgpa, s.email, s.status].join(',')
                                            )
                                        ].join('\n');

                                        const blob = new Blob([csvContent], { type: 'text/csv' });
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `candidates_${selectedDrive.role.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Export Resumes</span>
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="mb-6 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or roll number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                            />
                        </div>

                        {/* Students Table */}
                        <div className="space-y-3">
                            {filteredStudents.map((student, idx) => (
                                <StudentRow key={student.id} student={student} index={idx} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Active Drives */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Drives</h3>
                        <div className="space-y-4">
                            {mockRecruiterData.activeDrives.map((drive) => (
                                <DriveCard
                                    key={drive.id}
                                    drive={drive}
                                    isSelected={selectedDrive.id === drive.id}
                                    onClick={() => setSelectedDrive(drive)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Hiring Insights
                        </h3>
                        <p className="text-indigo-100 text-sm mb-4">
                            Your acceptance rate is 15% higher than industry average. Great job attracting top talent!
                        </p>
                        <div className="flex items-center justify-between text-sm font-medium bg-white/10 rounded-lg p-3">
                            <span>Quality Score</span>
                            <span className="text-yellow-300">9.2/10</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setShowFilterModal(false)}
                    />

                    {/* Modal */}
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md z-50 border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Candidates</h3>

                        <div className="space-y-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Selected">Selected</option>
                                </select>
                            </div>

                            {/* CGPA Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Minimum CGPA
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={filters.minCGPA}
                                    onChange={(e) => setFilters({ ...filters, minCGPA: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.0"
                                />
                            </div>

                            {/* Branch Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Branch
                                </label>
                                <select
                                    value={filters.branch}
                                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Branches</option>
                                    <option value="CSE">CSE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ME">ME</option>
                                    <option value="CE">CE</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setFilters({ status: 'all', minCGPA: 0, branch: 'all' });
                                    setShowFilterModal(false);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
        green: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
        yellow: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800' },
    };

    const c = colors[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all`}
        >
            <div className={`p-3 rounded-xl ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.text}`} />
            </div>
            <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            </div>
        </motion.div>
    );
}

function DriveCard({ drive, isSelected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-xl border text-left transition-all ${isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{drive.role}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{drive.type}</p>
                </div>
                <div className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                    {drive.status}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm border-t border-gray-100 dark:border-slate-700/50 pt-3 mt-1">
                <div>
                    <div className="text-gray-400 text-xs">Applied</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">{drive.applicants}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Shortlisted</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">{drive.shortlisted}</div>
                </div>
                <div>
                    <div className="text-gray-400 text-xs">Selected</div>
                    <div className="font-medium text-gray-700 dark:text-gray-300">{drive.selected}</div>
                </div>
            </div>
        </button>
    );
}

function StudentRow({ student, index }: any) {
    const statusColors: any = {
        Applied: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
        Shortlisted: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
        Selected: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', border: 'border-green-100 dark:border-green-800' },
    };

    const colors = statusColors[student.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-white dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group"
        >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-gray-600 dark:text-gray-200 font-semibold shadow-inner">
                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</span>
                        <div className={`px-2 py-0.5 ${colors.bg} ${colors.border} border rounded-full ml-auto sm:ml-2`}>
                            <span className={`text-xs font-medium ${colors.text}`}>{student.status}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{student.branch}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>CGPA: <span className="text-gray-900 dark:text-white font-medium">{student.cgpa}</span></span>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex gap-1">
                            {student.skills.slice(0, 3).map((skill: string) => (
                                <span key={skill} className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-xs text-gray-700 dark:text-gray-300">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2 sm:mt-0">
                    <button className="flex-1 sm:flex-none px-3 py-2 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                        Profile
                    </button>
                    <button
                        onClick={async () => {
                            alert(`📄 Resume: ${student.resume || 'Not uploaded'}\n\n` +
                                `Student: ${student.name}\n` +
                                `Roll No: ${student.rollNo}\n\n` +
                                `ℹ️ In production, this would download the resume from Firebase Storage.\n\n` +
                                `For demo purposes, the resume filename is shown above.`);
                        }}
                        className="flex-1 sm:flex-none px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                        <FileDown className="w-4 h-4" />
                        Resume
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
