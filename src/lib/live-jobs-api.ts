// Live Jobs API Service - Uses real job APIs
const ADZUNA_APP_ID = process.env.NEXT_PUBLIC_ADZUNA_APP_ID || 'demo';
const ADZUNA_APP_KEY = process.env.NEXT_PUBLIC_ADZUNA_APP_KEY || 'demo';

// In-memory cache for faster loading
const jobsCache: { [key: string]: { jobs: LiveJob[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export interface LiveJob {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    salary_min: number;
    salary_max: number;
    contract_type: 'permanent' | 'contract' | 'internship';
    created: Date;
    redirect_url: string;
    category: string;
    // Additional fields for UI
    url?: string;
    salary?: string;
    type?: string;
    tags?: string[];
    source?: string;
}

/**
 * Fetch live jobs from Adzuna API
 * Free tier: 250 calls/month
 * Docs: https://developer.adzuna.com/
 */
export async function fetchLiveJobs(
    query: string = 'software engineer',
    location: string = 'india',
    page: number = 1
): Promise<{ jobs: LiveJob[]; total: number }> {
    try {
        const url = `https://api.adzuna.com/v1/api/jobs/${location}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&what=${encodeURIComponent(query)}&results_per_page=20`;

        const response = await fetch(url);

        if (!response.ok) {
            console.error('Adzuna API error:', response.status);
            return { jobs: [], total: 0 };
        }

        const data = await response.json();

        const jobs: LiveJob[] = data.results.map((job: any) => ({
            id: job.id,
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            description: job.description.substring(0, 300) + '...',
            salary_min: job.salary_min || 0,
            salary_max: job.salary_max || 0,
            contract_type: job.contract_type || 'permanent',
            created: new Date(job.created),
            redirect_url: job.redirect_url,
            category: job.category.label
        }));

        return {
            jobs,
            total: data.count || 0
        };
    } catch (error) {
        console.error('Error fetching live jobs:', error);
        // Fallback to free public jobs API
        return fetchRemoteOKJobs(query);
    }
}

/**
 * Backup: RemoteOK API (completely free, no key needed)
 * Great for remote/tech jobs
 */
async function fetchRemoteOKJobs(query: string): Promise<{ jobs: LiveJob[]; total: number }> {
    try {
        const response = await fetch('https://remoteok.com/api');
        const data = await response.json();

        // Filter relevant jobs
        const filtered = data
            .slice(1) // First item is metadata
            .filter((job: any) =>
                job.position?.toLowerCase().includes(query.toLowerCase()) ||
                job.company?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 20);

        const jobs: LiveJob[] = filtered.map((job: any) => ({
            id: job.id,
            title: job.position,
            company: job.company,
            location: job.location || 'Remote',
            description: job.description?.substring(0, 300) + '...' || 'No description',
            salary_min: job.salary_min || 0,
            salary_max: job.salary_max || 0,
            contract_type: 'permanent',
            created: new Date(job.date),
            redirect_url: job.url,
            category: job.tags?.[0] || 'Technology'
        }));

        return {
            jobs,
            total: filtered.length
        };
    } catch (error) {
        console.error('Error fetching RemoteOK jobs:', error);
        return { jobs: [], total: 0 };
    }
}

/**
 * Fetch jobs from free GitHub Jobs alternative (The Muse)
 */
export async function fetchTheMuseJobs(
    query: string = 'Software Engineer',
    page: number = 0
): Promise<{ jobs: LiveJob[]; total: number }> {
    try {
        const response = await fetch(
            `https://www.themuse.com/api/public/jobs?category=Engineering&page=${page}&descending=true`
        );
        const data = await response.json();

        const jobs: LiveJob[] = data.results.map((job: any) => ({
            id: job.id,
            title: job.name,
            company: job.company.name,
            location: job.locations[0]?.name || 'Multiple Locations',
            description: job.contents.substring(0, 300) + '...',
            salary_min: 0,
            salary_max: 0,
            contract_type: job.type === 'internship' ? 'internship' : 'permanent',
            created: new Date(job.publication_date),
            redirect_url: job.refs.landing_page,
            category: job.categories[0]?.name || 'Engineering'
        }));

        return {
            jobs,
            total: data.page_count * data.results_per_page
        };
    } catch (error) {
        console.error('Error fetching The Muse jobs:', error);
        return { jobs: [], total: 0 };
    }
}

/**
 * Aggregate jobs from multiple sources with caching
 */
export async function fetchAggregatedJobs(query: string = 'software'): Promise<LiveJob[]> {
    const cacheKey = query.toLowerCase();

    // Check cache first for faster loading
    const cached = jobsCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('[Jobs] Using cached results for:', query);
        return cached.jobs;
    }

    console.log('[Jobs] Fetching fresh jobs for:', query);
    const [remoteOK, themuse] = await Promise.all([
        fetchRemoteOKJobs(query),
        fetchTheMuseJobs(query)
    ]);

    const allJobs = [...remoteOK.jobs, ...themuse.jobs];

    // Sort by date (newest first)
    const sortedJobs = allJobs.sort((a, b) => b.created.getTime() - a.created.getTime());

    // Cache the results
    jobsCache[cacheKey] = { jobs: sortedJobs, timestamp: Date.now() };

    return sortedJobs;
}

/**
 * Format salary for display
 */
export function formatSalary(min: number, max: number): string {
    if (!min && !max) return 'Not specified';
    if (min && max) {
        // Convert to LPA for Indian context
        const minLPA = (min / 100000).toFixed(1);
        const maxLPA = (max / 100000).toFixed(1);
        return `₹${minLPA}-${maxLPA} LPA`;
    }
    if (min) return `From ₹${(min / 100000).toFixed(1)} LPA`;
    if (max) return `Up to ₹${(max / 100000).toFixed(1)} LPA`;
    return 'Not specified';
}
