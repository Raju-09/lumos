/**
 * Live Jobs Page - ACTUAL API INTEGRATION
 * Fetches real jobs from RemoteOK & The Muse APIs
 */
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Briefcase, MapPin, DollarSign, ExternalLink, Loader2 } from 'lucide-react';
import { fetchAggregatedJobs, LiveJob } from '@/lib/live-jobs-api';

function LiveJobsContent() {
    const searchParams = useSearchParams();
    const queryFromUrl = searchParams.get('q') || 'software engineer';

    const [jobs, setJobs] = useState<LiveJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(queryFromUrl);
    const [searchInput, setSearchInput] = useState(queryFromUrl);

    useEffect(() => {
        loadJobs();
    }, [search]);

    useEffect(() => {
        // Update if URL query changes
        if (queryFromUrl !== search) {
            setSearch(queryFromUrl);
            setSearchInput(queryFromUrl);
        }
    }, [queryFromUrl]);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const result = await fetchAggregatedJobs(search);
            setJobs(result);
        } catch (error) {
            console.error('Failed to load jobs:', error);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearch(searchInput);
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        job.company.toLowerCase().includes(searchInput.toLowerCase()) ||
        job.tags?.some(tag => tag.toLowerCase().includes(searchInput.toLowerCase()))
    );

    const [selectedJob, setSelectedJob] = useState<LiveJob | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6 space-y-6 transition-colors">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Live Job Openings</h1>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Real-time jobs from RemoteOK & The Muse
                </p>
            </div>

            {/* Search */}
            <div className="flex gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search jobs (e.g. React Developer, Python)..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">Loading jobs from APIs...</span>
                </div>
            )}

            {/* Jobs Grid */}
            {!loading && (
                <>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Found {filteredJobs.length} live job{filteredJobs.length !== 1 ? 's' : ''}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredJobs.map((job, idx) => (
                            <JobCard key={idx} job={job} onViewDetails={() => setSelectedJob(job)} />
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No jobs found. Try a different search term.
                        </div>
                    )}
                </>
            )}

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedJob(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{selectedJob.company}</p>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 border-y border-gray-100 dark:border-slate-800 py-4">
                            {selectedJob.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{selectedJob.location}</span>
                                </div>
                            )}
                            {selectedJob.salary && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{selectedJob.salary}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                <span>{selectedJob.type || 'Full-Time'}</span>
                            </div>
                        </div>

                        {selectedJob.tags && (
                            <div className="flex flex-wrap gap-2">
                                {selectedJob.tags.map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="prose dark:prose-invert max-w-none text-sm text-gray-600 dark:text-gray-400">
                            <p>Click "Apply Now" to view the full job description on the source website.</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <a
                                href={selectedJob.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Apply Now
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function LiveJobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <LiveJobsContent />
        </Suspense>
    );
}

function JobCard({ job, onViewDetails }: { job: LiveJob, onViewDetails: () => void }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white mb-1" title={job.title}>
                        {job.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{job.company}</p>
                </div>
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded whitespace-nowrap ml-2">
                    {job.source}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 flex-1">
                {job.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{job.location}</span>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span>{job.type || 'Full-Time'}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                    onClick={onViewDetails}
                    className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm font-medium"
                >
                    View Details
                </button>
                <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Apply Now
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
