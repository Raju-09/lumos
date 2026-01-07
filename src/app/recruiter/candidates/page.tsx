'use client';

import { useState } from 'react';
import { Search, Filter, Download, Mail, Phone, ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCandidates = [
    { id: 1, name: 'Arjun Kumar', role: 'Software Engineer', status: 'Shortlisted', score: 85, email: 'arjun@example.com' },
    { id: 2, name: 'Priya Sharma', role: 'SDE Intern', status: 'Reviewing', score: 92, email: 'priya@example.com' },
    { id: 3, name: 'Rahul Verma', role: 'Software Engineer', status: 'Rejected', score: 65, email: 'rahul@example.com' },
    { id: 4, name: 'Sneha Gupta', role: 'SDE Intern', status: 'Interview', score: 88, email: 'sneha@example.com' },
    { id: 5, name: 'Vikram Singh', role: 'Product Analyst', status: 'New', score: 78, email: 'vikram@example.com' },
];

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState(mockCandidates);
    const [search, setSearch] = useState('');

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.role.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidates</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage applications across all drives</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Export All</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search candidates by name, email or role..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Candidates Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Candidate</th>
                                <th className="px-6 py-4">Applying For</th>
                                <th className="px-6 py-4">Match Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {filteredCandidates.map((candidate, idx) => (
                                <motion.tr
                                    key={candidate.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">{candidate.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 dark:text-white">{candidate.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full max-w-[80px] h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${candidate.score >= 80 ? 'bg-green-500' : candidate.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${candidate.score}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{candidate.score}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={candidate.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300" title="View Profile">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-gray-300" title="Email">
                                                <Mail className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredCandidates.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No candidates found matching "{search}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        'New': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
        'Reviewing': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900',
        'Shortlisted': 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900',
        'Interview': 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
        'Rejected': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['New']}`}>
            {status}
        </span>
    );
}
