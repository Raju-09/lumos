'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Users, MapPin, MoreVertical, Briefcase, X, Loader2 } from 'lucide-react';
import { FirestoreDriveService } from '@/lib/firestore-service';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newDrive, setNewDrive] = useState<{
        companyName: string;
        role: string;
        type: 'Full-Time' | 'Internship' | 'Contract';
        location: string[];
        ctcMin: number;
        ctcMax: number;
        description: string;
        eligibility: {
            cgpaCutoff: number;
            allowedBranches: string[];
            maxBacklogs: number;
        };
        deadline: string;
    }>({
        companyName: '',
        role: '',
        type: 'Full-Time',
        location: [''],
        ctcMin: 0,
        ctcMax: 0,
        description: '',
        eligibility: {
            cgpaCutoff: 7.0,
            allowedBranches: [],
            maxBacklogs: 0
        },
        deadline: ''
    });

    // Filter by status or search
    const filteredDrives = mockDrives.filter(drive => {
        const lowerCaseSearch = search.toLowerCase();
        return (
            drive.role.toLowerCase().includes(lowerCaseSearch) ||
            drive.location.toLowerCase().includes(lowerCaseSearch) ||
            drive.type.toLowerCase().includes(lowerCaseSearch)
        );
    });

    const handleCreateDrive = async () => {
        setCreating(true);
        try {
            const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');

            await FirestoreDriveService.create({
                ...newDrive,
                companyName: user.name || newDrive.companyName,
                status: 'OPEN',
                logo: newDrive.companyName.charAt(0).toUpperCase(),
                deadline: new Date(newDrive.deadline)
            });

            alert('✅ Drive created successfully! Students can now see and apply.');
            setShowCreateModal(false);
            // Reset form
            setNewDrive({
                companyName: '',
                role: '',
                type: 'Full-Time',
                location: [''],
                ctcMin: 0,
                ctcMax: 0,
                description: '',
                eligibility: {
                    cgpaCutoff: 7.0,
                    allowedBranches: [],
                    maxBacklogs: 0
                },
                deadline: ''
            });
        } catch (error) {
            console.error('Error creating drive:', error);
            alert('Failed to create drive. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Drives</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your job postings and applications</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Drive</span>
                </motion.button>
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

            {/* Create Drive Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                            onClick={() => !creating && setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 w-full max-w-2xl z-50 border border-gray-200 dark:border-slate-700 max-h-[85vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Drive</h3>
                                <button onClick={() => !creating && setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={newDrive.role}
                                        onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
                                        placeholder="e.g., Software Engineer"
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                {/* Type & Location */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Type *
                                        </label>
                                        <select
                                            value={newDrive.type}
                                            onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value as any })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Contract">Contract</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            value={newDrive.location[0]}
                                            onChange={(e) => setNewDrive({ ...newDrive, location: [e.target.value] })}
                                            placeholder="e.g., Bangalore"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* CTC Range */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Min CTC (LPA) *
                                        </label>
                                        <input
                                            type="number"
                                            value={newDrive.ctcMin}
                                            onChange={(e) => setNewDrive({ ...newDrive, ctcMin: parseFloat(e.target.value) })}
                                            placeholder="e.g., 8"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Max CTC (LPA) *
                                        </label>
                                        <input
                                            type="number"
                                            value={newDrive.ctcMax}
                                            onChange={(e) => setNewDrive({ ...newDrive, ctcMax: parseFloat(e.target.value) })}
                                            placeholder="e.g., 12"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Eligibility */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Min CGPA *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={newDrive.eligibility.cgpaCutoff}
                                            onChange={(e) => setNewDrive({
                                                ...newDrive,
                                                eligibility: { ...newDrive.eligibility, cgpaCutoff: parseFloat(e.target.value) }
                                            })}
                                            placeholder="e.g., 7.0"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Max Backlogs
                                        </label>
                                        <input
                                            type="number"
                                            value={newDrive.eligibility.maxBacklogs}
                                            onChange={(e) => setNewDrive({
                                                ...newDrive,
                                                eligibility: { ...newDrive.eligibility, maxBacklogs: parseInt(e.target.value) }
                                            })}
                                            placeholder="e.g., 0"
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Application Deadline *
                                    </label>
                                    <input
                                        type="date"
                                        value={newDrive.deadline}
                                        onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Job Description
                                    </label>
                                    <textarea
                                        value={newDrive.description}
                                        onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
                                        placeholder="Enter job description, requirements, responsibilities..."
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={creating}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateDrive}
                                    disabled={creating || !newDrive.role || !newDrive.deadline}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {creating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Drive'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Filter Modal */}
            {showFilterModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setShowFilterModal(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 w-full max-w-md z-50 border border-gray-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter Drives</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                                    <option>All Status</option>
                                    <option>Active</option>
                                    <option>Draft</option>
                                    <option>Closed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Type
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white">
                                    <option>All Types</option>
                                    <option>Full-Time</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
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
