'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Briefcase,
    MapPin,
    DollarSign,
    Clock,
    ExternalLink,
    Search,
    Filter,
    RefreshCw,
    TrendingUp,
    Building2
} from 'lucide-react';
import { fetchAggregatedJobs, formatSalary, type LiveJob } from '@/lib/live-jobs-api';

export default function LiveJobsPage() {
    const [jobs, setJobs] = useState<LiveJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('software engineer');
    const [filter, setFilter] = useState<'all' | 'permanent' | 'internship'>('all');

    const loadJobs = async () => {
        setLoading(true);
        try {
            const liveJobs = await fetchAggregatedJobs(search);
            setJobs(liveJobs);
        } catch (error) {
            console.error('Failed to load jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        if (filter !== 'all' && job.contract_type !== filter) return false;
        return true;
    });

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor(seconds / 3600);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just posted';
    };

    return (
        <div className="min-h-screen p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-start"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">Live Job Opportunities</h1>
                    <p className="text-muted-foreground">
                        Real-time jobs from top job boards • Updated continuously
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">Live Data</span>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                            <Briefcase className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{jobs.length}</div>
                            <div className="text-sm text-muted-foreground">Active Jobs</div>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-500/10 rounded-lg">
                            <Building2 className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">{new Set(jobs.map(j => j.company)).size}</div>
                            <div className="text-sm text-muted-foreground">Companies</div>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {jobs.filter(j => getTimeAgo(j.created).includes('h')).length}
                            </div>
                            <div className="text-sm text-muted-foreground">Posted Today</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search jobs (e.g., 'Python Developer', 'Data Scientist')..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && loadJobs()}
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-muted'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('permanent')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'permanent' ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-muted'
                            }`}
                    >
                        Full-Time
                    </button>
                    <button
                        onClick={() => setFilter('internship')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'internship' ? 'bg-primary text-white' : 'bg-card border border-border hover:bg-muted'
                            }`}
                    >
                        Internship
                    </button>
                    <button
                        onClick={loadJobs}
                        disabled={loading}
                        className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* Jobs List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <RefreshCw className="w-8 h-8 mx-auto mb-4 text-primary animate-spin" />
                        <p className="text-muted-foreground">Fetching latest jobs...</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job, idx) => (
                        <LiveJobCard key={job.id} job={job} index={idx} />
                    ))}
                </div>
            )}

            {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No jobs found. Try a different search term.</p>
                </div>
            )}
        </div>
    );
}

function LiveJobCard({ job, index }: { job: LiveJob; index: number }) {
    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor(seconds / 3600);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just posted';
    };

    const isNew = job.created && Date.now() - job.created.getTime() < 24 * 60 * 60 * 1000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-6 hover-lift"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {isNew && (
                            <div className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
                                NEW
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{job.company}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{job.location}</span>
                </div>
                {(job.salary_min || job.salary_max) ? (
                    <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                ) : null}
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{getTimeAgo(job.created)}</span>
                </div>
                <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                    {job.contract_type}
                </div>
            </div>

            <div className="flex gap-3">
                <a
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                >
                    <span>Apply Now</span>
                    <ExternalLink className="w-4 h-4" />
                </a>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    Save Job
                </button>
            </div>
        </motion.div>
    );
}
