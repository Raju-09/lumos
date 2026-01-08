/**
 * Student Settings Page
 * Profile management and preferences
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Book, Save, Bell, Lock, Palette, CheckCircle, GraduationCap } from 'lucide-react';

export default function SettingsPage() {
    const [userData, setUserData] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        branch: '',
        academicYear: 4,
        cgpa: '',
        skills: '',
        notifications: true,
        emailAlerts: true
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        setUserData(user);
        setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            branch: user.branch || '',
            academicYear: user.academicYear || 4,
            cgpa: user.cgpa || '',
            skills: (user.skills || []).join(', '),
            notifications: user.notifications !== false,
            emailAlerts: user.emailAlerts !== false
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);

        // Update localStorage
        const updatedUser = {
            ...userData,
            name: formData.name,
            phone: formData.phone,
            branch: formData.branch,
            academicYear: formData.academicYear,
            cgpa: formData.cgpa,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            notifications: formData.notifications,
            emailAlerts: formData.emailAlerts
        };

        localStorage.setItem('lumos_user', JSON.stringify(updatedUser));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Manage your profile and preferences</p>
                </motion.div>

                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Profile Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                            <select
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Branch</option>
                                <option value="CSE">Computer Science (CSE)</option>
                                <option value="ECE">Electronics & Communication (ECE)</option>
                                <option value="EEE">Electrical & Electronics (EEE)</option>
                                <option value="ME">Mechanical Engineering (ME)</option>
                                <option value="CE">Civil Engineering (CE)</option>
                                <option value="IT">Information Technology (IT)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                            <select
                                value={formData.academicYear}
                                onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={1}>1st Year</option>
                                <option value={2}>2nd Year</option>
                                <option value={3}>3rd Year</option>
                                <option value={4}>4th Year</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                value={formData.cgpa}
                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                placeholder="8.5"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            placeholder="React, Python, Machine Learning, Java"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </motion.div>

                {/* Notifications Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        Notifications
                    </h2>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <div className="font-medium text-gray-900">Push Notifications</div>
                                <div className="text-sm text-gray-500">Get notified about new drives and updates</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.notifications}
                                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                            />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                            <div>
                                <div className="font-medium text-gray-900">Email Alerts</div>
                                <div className="text-sm text-gray-500">Receive placement updates via email</div>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.emailAlerts}
                                onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                            />
                        </label>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                >
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
