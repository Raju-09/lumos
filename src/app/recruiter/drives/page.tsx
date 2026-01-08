'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Users, MapPin, MoreVertical, Briefcase } from 'lucide-react';

const mockDrives = [
    {
        id: 1,
        role: 'Software Engineer',
        type: 'Full-Time',
        location: 'Bangalore',
        applicants: 45,
        status: 'Active',
        postedDate: '2024-01-15',
        deadline: '2024-02-15'
    },
    {
        id: 2,
        role: 'SDE Intern',
        type: 'Internship',
        location: 'Remote',
        applicants: 30,
        status: 'Active',
        postedDate: '2024-01-20',
        deadline: '2024-02-20'
    },
    {
        id: 3,
        role: 'Product Analyst',
        type: 'Full-Time',
        location: 'Gurgaon',
        applicants: 12,
        status: 'Draft',
        postedDate: '2024-01-25',
        deadline: '2024-02-25'
    }
];

export default function MyDrivesPage() {
    const [search, setSearch] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Filter by status or search
    const filteredDrives = mockDrives.filter(drive => {
        const lowerCaseSearch = search.toLowerCase();
        return (
            drive.role.toLowerCase().includes(lowerCaseSearch) ||
            drive.location.toLowerCase().includes(lowerCaseSearch) ||
            drive.type.toLowerCase().includes(lowerCaseSearch)
        );
    });

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Drives</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your job postings and applications</p>
                </div>
                <button
                    onClick={() => {
                        alert('Create New Drive\n\nThis feature will open a modal to create a new campus drive.\n\nIn production, this would:\n- Open a form modal\n- Collect drive details (role, location, eligibility, etc.)\n- Save to Firebase\n- Notify eligible students');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Drive</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drives..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowFilterModal(true)}
                    className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Drives Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrives.map((drive) => (
                    <DriveCard key={drive.id} drive={drive} />
                ))}
            </div>
            {filteredDrives.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No drives found matching "{search}"
                </div>
            )}
        </div>
    );
}

function DriveCard({ drive }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {drive.role}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs">{drive.type}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {drive.location}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-slate-800 mb-4">
                <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Applicants</div>
                    <div className="flex items-center gap-1 font-semibold text-gray-900 dark:text-white">
                        <Users className="w-4 h-4 text-blue-500" />
                        {drive.applicants}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <div className={`text-sm font-medium ${drive.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                        {drive.status}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Posted {drive.postedDate}
                </div>
                <div className="text-red-500 dark:text-red-400">
                    Deadline: {drive.deadline}
                </div>
            </div>
        </motion.div>
    );
}
