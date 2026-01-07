/**
 * Admin Drives Management - REAL-TIME FIRESTORE
 * Real data, working Create/Edit/Delete with real-time updates
 */
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Building2,
    Users,
    CalendarDays,
    DollarSign,
    X
} from 'lucide-react';
import { FirestoreDriveService, FirestoreApplicationService } from '@/lib/firestore-service';
import { SkeletonCard } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

export default function DrivesPage() {
    const [drives, setDrives] = useState<any[]>([]);
    const [filteredDrives, setFilteredDrives] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'upcoming' | 'closed'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingDrive, setEditingDrive] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeDrives: (() => void) | undefined;
        let unsubscribeAuth: (() => void) | undefined;

        // Use the auth wrapper from firestore-service for clean auth handling
        import('@/lib/firestore-service').then(({ onAuthChange }) => {
            unsubscribeAuth = onAuthChange(async (user) => {
                if (user) {
                    console.log('[Admin Drives] User authenticated:', user.email);
                    try {
                        // Subscribe to drives with real-time updates
                        // The service now handles auth internally
                        unsubscribeDrives = FirestoreDriveService.subscribe(async (firestoreDrives) => {
                            try {
                                const apps = await FirestoreApplicationService.getAll();

                                const enriched = firestoreDrives.map(drive => {
                                    const driveApps = apps.filter(a => a.driveId === drive.id);
                                    return {
                                        ...drive,
                                        applicants: driveApps.length,
                                        shortlisted: driveApps.filter(a => a.status === 'Shortlisted').length,
                                        status: new Date(drive.deadline) > new Date() ? 'OPEN' : 'CLOSED'
                                    };
                                });

                                setDrives(enriched);
                            } catch (e) {
                                console.error('[Admin Drives] Error enriching drives:', e);
                                setDrives(firestoreDrives);
                            }
                            setLoading(false);
                        });
                    } catch (error) {
                        console.error('[Admin Drives] Error setting up listeners:', error);
                        setLoading(false);
                    }
                } else {
                    console.log('[Admin Drives] Not authenticated');
                    setLoading(false);
                }
            });
        });

        return () => {
            unsubscribeDrives?.();
            unsubscribeAuth?.();
        };
    }, []);

    useEffect(() => {
        filterDrives();
    }, [drives, search, filter]);


    const filterDrives = () => {
        let filtered = drives;

        if (search) {
            filtered = filtered.filter(d =>
                d.companyName.toLowerCase().includes(search.toLowerCase()) ||
                d.role.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (filter !== 'all') {
            filtered = filtered.filter(d => d.status.toLowerCase() === filter);
        }

        setFilteredDrives(filtered);
    };

    const handleCreate = () => {
        setEditingDrive(null);
        setShowModal(true);
    };

    const handleEdit = (drive: any) => {
        setEditingDrive(drive);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this drive?')) {
            try {
                await FirestoreDriveService.delete(id);
                // Real-time listener will update the UI automatically
            } catch (error) {
                console.error('Error deleting drive:', error);
                alert('Failed to delete drive');
            }
        }
    };

    const handleSave = async (driveData: any) => {
        console.log('Attempting to save drive:', driveData);
        try {
            if (editingDrive) {
                console.log('Updating existing drive:', editingDrive.id);
                await FirestoreDriveService.update(editingDrive.id, driveData);
                console.log('Drive updated successfully');
            } else {
                console.log('Creating new drive...');
                const result = await FirestoreDriveService.create(driveData);
                console.log('Drive created successfully:', result);
            }
            setShowModal(false);
            // Real-time listener will update the UI automatically
        } catch (error: any) {
            console.error('Error saving drive:', error);
            console.error('Error code:', error?.code);
            console.error('Error message:', error?.message);

            // More specific error messages
            if (error?.code === 'permission-denied') {
                alert('Permission denied! Please deploy Firestore rules to Firebase Console:\n\n1. Go to Firebase Console → Firestore → Rules\n2. Paste the content of firestore.rules file\n3. Click Publish');
            } else if (error?.code === 'unavailable') {
                alert('Firestore is unavailable. Check your internet connection.');
            } else {
                alert(`Failed to save drive: ${error?.message || 'Unknown error'}\n\nCheck browser console for details.`);
            }
        }
    };

    const stats = {
        total: drives.length,
        applications: drives.reduce((sum, d) => sum + d.applicants, 0),
        active: drives.filter(d => d.status === 'OPEN').length,
        upcoming: drives.filter(d => d.status === 'UPCOMING').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
                        <p className="text-gray-600 text-sm">Loading...</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
                    <p className="text-gray-600 text-sm">Create, configure, and monitor placement drives</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create New Drive
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={Building2} label="Total Drives" value={stats.total} />
                <StatCard icon={Users} label="Total Applications" value={stats.applications} />
                <StatCard icon={CalendarDays} label="Active Drives" value={stats.active} color="green" />
                <StatCard icon={CalendarDays} label="Upcoming" value={stats.upcoming} color="orange" />
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search drives by company or role..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'open', 'upcoming', 'closed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Drives List */}
            <div className="space-y-4">
                {filteredDrives.map((drive) => (
                    <DriveCard
                        key={drive.id}
                        drive={drive}
                        onEdit={() => handleEdit(drive)}
                        onDelete={() => handleDelete(drive.id)}
                    />
                ))}
            </div>

            {filteredDrives.length === 0 && !loading && (
                <EmptyState
                    icon={Building2}
                    title="No drives found"
                    description="Click 'Create New Drive' to add your first placement drive."
                    actionLabel="Create New Drive"
                    onAction={handleCreate}
                />
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <DriveModal
                    drive={editingDrive}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color = 'blue' }: any) {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50',
        green: 'text-green-600 bg-green-50',
        orange: 'text-orange-600 bg-orange-50'
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className={`w-5 h-5 ${colors[color].split(' ')[0]}`} />
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    );
}

function DriveCard({ drive, onEdit, onDelete }: any) {
    const daysUntilDeadline = Math.ceil(
        (new Date(drive.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{drive.companyName}</h3>
                        <p className="text-sm text-gray-600">{drive.role}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${drive.status === 'OPEN'
                            ? 'bg-green-100 text-green-700'
                            : drive.status === 'UPCOMING'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {drive.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                    <div className="text-xs text-gray-500">Package</div>
                    <div className="text-sm font-medium text-gray-900">
                        ₹{drive.ctcMin}-{drive.ctcMax} LPA
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm font-medium text-gray-900">
                        {Array.isArray(drive.location) ? drive.location.join(', ') : (drive.location || 'Multiple')}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Deadline</div>
                    <div className={`text-sm font-medium ${daysUntilDeadline < 3 ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(drive.deadline).toLocaleDateString()} ({daysUntilDeadline}d left)
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Applicants</div>
                    <div className="text-sm font-medium text-gray-900">
                        {drive.applicants} / {drive.eligible || 0}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>
        </motion.div>
    );
}

function DriveModal({ drive, onClose, onSave }: any) {
    const [formData, setFormData] = useState({
        companyName: drive?.companyName || '',
        role: drive?.role || '',
        type: drive?.type || 'Full-Time',
        ctcMin: drive?.ctcMin || '',
        ctcMax: drive?.ctcMax || '',
        location: Array.isArray(drive?.location) ? drive.location.join(', ') : (drive?.location || ''),
        deadline: drive?.deadline ? new Date(drive.deadline).toISOString().split('T')[0] : '',
        cgpaCutoff: drive?.eligibility?.cgpaCutoff || 0,
        branches: drive?.eligibility?.allowedBranches?.join(', ') || 'CSE, IT',
        backlogs: drive?.eligibility?.maxBacklogs || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            companyName: formData.companyName,
            role: formData.role,
            type: formData.type,
            ctcMin: Number(formData.ctcMin),
            ctcMax: Number(formData.ctcMax),
            location: formData.location.split(',').map((loc: string) => loc.trim()).filter((loc: string) => loc),
            deadline: new Date(formData.deadline),
            status: 'OPEN',
            logo: '🏢',
            eligibility: {
                cgpaCutoff: Number(formData.cgpaCutoff),
                allowedBranches: formData.branches.split(',').map((b: string) => b.trim()),
                maxBacklogs: Number(formData.backlogs),
            },
            rounds: ['Resume Screening', 'Technical Round', 'HR Round']
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {drive ? 'Edit Drive' : 'Create New Drive'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                            >
                                <option>Full-Time</option>
                                <option>Internship</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min CTC (LPA)</label>
                            <input
                                type="number"
                                value={formData.ctcMin}
                                onChange={(e) => setFormData({ ...formData, ctcMin: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max CTC (LPA)</label>
                            <input
                                type="number"
                                value={formData.ctcMax}
                                onChange={(e) => setFormData({ ...formData, ctcMax: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Locations (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="e.g. Bangalore, Hyderabad, Remote"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                            <input
                                type="date"
                                value={formData.deadline}
                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CGPA Cutoff</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.cgpaCutoff}
                                onChange={(e) => setFormData({ ...formData, cgpaCutoff: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Backlogs</label>
                            <input
                                type="number"
                                value={formData.backlogs}
                                onChange={(e) => setFormData({ ...formData, backlogs: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branches</label>
                            <input
                                type="text"
                                value={formData.branches}
                                onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                                placeholder="CSE, IT, ECE"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {drive ? 'Update Drive' : 'Create Drive'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
