'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Award,
    Briefcase,
    Calendar,
    Download,
    Filter,
    Sparkles,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

// Mock data
const placementTrends = [
    { month: 'Sep', placements: 12, companies: 5 },
    { month: 'Oct', placements: 28, companies: 12 },
    { month: 'Nov', placements: 45, companies: 18 },
    { month: 'Dec', placements: 67, companies: 25 },
    { month: 'Jan', placements: 89, companies: 30 },
    { month: 'Feb', placements: 112, companies: 22 },
];

const departmentData = [
    { dept: 'CSE', placed: 85, total: 100, color: '#3B82F6' },
    { dept: 'ECE', placed: 70, total: 100, color: '#10B981' },
    { dept: 'EEE', placed: 60, total: 100, color: '#F59E0B' },
    { dept: 'MECH', placed: 50, total: 100, color: '#EF4444' },
    { dept: 'CIVIL', placed: 45, total: 100, color: '#8B5CF6' },
];

const packageData = [
    { range: '0-5 LPA', count: 45, color: '#60A5FA' },
    { range: '5-10 LPA', count: 35, color: '#34D399' },
    { range: '10-15 LPA', count: 20, color: '#FBBF24' },
    { range: '15+ LPA', count: 12, color: '#A78BFA' },
];

const topCompanies = [
    { name: 'Google', offers: 15, avgPackage: 18, logo: 'G' },
    { name: 'Microsoft', offers: 12, avgPackage: 16, logo: 'M' },
    { name: 'Amazon', offers: 10, avgPackage: 15, logo: 'A' },
    { name: 'Goldman Sachs', offers: 8, avgPackage: 20, logo: 'GS' },
    { name: 'Atlassian', offers: 7, avgPackage: 17, logo: 'At' },
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

export default function AdminDashboard() {
    return (
        <div className="min-h-screen p-6 space-y-8 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-muted-foreground dark:text-gray-400">
                        Placement Season 2026 - Real-time insights
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Export Report</span>
                    </button>
                </div>
            </motion.div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Placement Rate"
                    value="72%"
                    change={+7}
                    icon={TrendingUp}
                    color="green"
                    subtitle="vs last year"
                />
                <MetricCard
                    title="Companies Visited"
                    value="25"
                    change={+5}
                    icon={Building2}
                    color="blue"
                    subtitle="current season"
                />
                <MetricCard
                    title="Avg Package"
                    value="8.5 LPA"
                    change={+1.2}
                    icon={DollarSign}
                    color="purple"
                    subtitle="+15% growth"
                />
                <MetricCard
                    title="Students Placed"
                    value="324"
                    change={+15}
                    icon={Users}
                    color="teal"
                    subtitle="out of 450"
                />
            </div>

            {/* Charts Row 1 - Main Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placement Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Placement Velocity</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Monthly breakdown of offers</p>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={placementTrends}>
                            <defs>
                                <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} className="dark:stroke-slate-700" />
                            <XAxis dataKey="month" stroke="#9ca3af" axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="placements"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPlacements)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Department Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dept. Performance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Offer percentage by branch</p>
                        </div>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" className="dark:stroke-slate-700" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="dept" type="category" stroke="#9ca3af" width={50} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="placed" radius={[0, 4, 4, 0]} barSize={20}>
                                {departmentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            {/* Charts Row 2 - Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Package Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Package Range</h3>
                    </div>

                    <div className="h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={packageData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="count"
                                    stroke="none"
                                >
                                    {packageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">324</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Total Offers</div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {packageData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-600 dark:text-gray-300">{item.range}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Recruiters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Recruiters</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Companies with highest intake & packages</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {topCompanies.map((company, idx) => (
                            <CompanyRow key={idx} company={company} rank={idx + 1} />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* AI Insights Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                            Lumos AI Insights
                            <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full font-medium">New</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-blue-50 text-sm">
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                CSE placement rate improved by <strong className="text-white">15% YoY</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                                ML/AI skills commanded <strong className="text-white">2x higher</strong> packages
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                Critical skill gap: <strong className="text-white">System Design & DSA</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                Recommendation: Schedule mock interviews for System Design
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function MetricCard({ title, value, change, icon: Icon, color, subtitle }: any) {
    const colors: any = {
        green: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800' },
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-800' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-800' },
        teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-800' },
    };

    const c = colors[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className={`bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 ${c.bg} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${change > 0
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                    {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{Math.abs(change)}{typeof change === 'number' && change < 5 ? ' LPA' : '%'}</span>
                </div>
            </div>
            <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</div>
            </div>
        </motion.div>
    );
}

function CompanyRow({ company, rank }: any) {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all group">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 dark:text-gray-500 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm">
                #{rank}
            </div>

            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center font-bold text-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                {company.logo}
            </div>

            <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">{company.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>{company.offers} offers</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-slate-600 rounded-full"></span>
                    <span>Avg: {company.avgPackage} LPA</span>
                </div>
            </div>

            <div className="text-right">
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    ₹{company.avgPackage}L
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Total CT C</div>
            </div>
        </div>
    );
}
