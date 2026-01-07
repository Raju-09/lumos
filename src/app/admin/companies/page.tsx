/**
 * Admin Companies Management
 * Manage participating companies and their profiles
 */
'use client';

import { useState } from 'react';
import { Search, Building2, Globe, MapPin, MoreVertical, Plus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const mockCompanies = [
    { id: 1, name: 'Google', industry: 'Technology', location: 'Bangalore, Mumbai', status: 'Active', openRoles: 5 },
    { id: 2, name: 'Microsoft', industry: 'Technology', location: 'Hyderabad, Bangalore', status: 'Active', openRoles: 3 },
    { id: 3, name: 'Deloitte', industry: 'Consulting', location: 'Hyderabad, Pune', status: 'Inactive', openRoles: 0 },
    { id: 4, name: 'Amazon', industry: 'E-commerce', location: 'Bangalore', status: 'Active', openRoles: 12 },
    { id: 5, name: 'Goldman Sachs', industry: 'Finance', location: 'Bangalore', status: 'Active', openRoles: 2 },
];

export default function CompaniesPage() {
    const [companies, setCompanies] = useState(mockCompanies);
    const [search, setSearch] = useState('');

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.industry.toLowerCase().includes(search.toLowerCase()) ||
        company.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Companies</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage company profiles and campus relationships</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                    <Plus className="w-4 h-4" />
                    <span>Add Company</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search companies by name, industry or location..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                </button>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company, idx) => (
                    <motion.div
                        key={company.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{company.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{company.industry}</p>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <MapPin className="w-4 h-4" />
                                <span>{company.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Globe className="w-4 h-4" />
                                <span>{company.openRoles} Active Roles</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${company.status === 'Active'
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                                }`}>
                                {company.status}
                            </span>
                            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">View Details</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredCompanies.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No companies found matching "{search}"
                </div>
            )}
        </div>
    );
}
