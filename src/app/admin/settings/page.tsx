/**
 * Admin Settings Page
 * System configuration and preferences
 */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Lock, Database, Save, CheckCircle, Users, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        // Notification Settings
        emailNotifications: true,
        smsNotifications: false,
        driveAlerts: true,

        // System Settings
        autoApproveApplications: false,
        requireResume: true,
        minCgpaDefault: 7.0,

        // Security
        twoFactorAuth: false,
        sessionTimeout: 30
    });

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('admin_settings', JSON.stringify(settings));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Settings</h1>
                    <p className="text-gray-600">Configure system preferences and security</p>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        Notification Settings
                    </h2>

                    <div className="space-y-4">
                        <ToggleSetting
                            label="Email Notifications"
                            description="Send email alerts for new applications"
                            checked={settings.emailNotifications}
                            onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                        />
                        <ToggleSetting
                            label="SMS Notifications"
                            description="Send SMS alerts (requires Twilio setup)"
                            checked={settings.smsNotifications}
                            onChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                        />
                        <ToggleSetting
                            label="Drive Alerts"
                            description="Notify when new drives are created"
                            checked={settings.driveAlerts}
                            onChange={(checked) => setSettings({ ...settings, driveAlerts: checked })}
                        />
                    </div>
                </motion.div>

                {/* System Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        System Configuration
                    </h2>

                    <div className="space-y-6">
                        <ToggleSetting
                            label="Auto-Approve Applications"
                            description="Automatically approve student applications"
                            checked={settings.autoApproveApplications}
                            onChange={(checked) => setSettings({ ...settings, autoApproveApplications: checked })}
                        />
                        <ToggleSetting
                            label="Require Resume"
                            description="Require resume upload for applications"
                            checked={settings.requireResume}
                            onChange={(checked) => setSettings({ ...settings, requireResume: checked })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Default Minimum CGPA
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                value={settings.minCgpaDefault}
                                onChange={(e) => setSettings({ ...settings, minCgpaDefault: parseFloat(e.target.value) })}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Security */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Security
                    </h2>

                    <div className="space-y-6">
                        <ToggleSetting
                            label="Two-Factor Authentication"
                            description="Require 2FA for admin access"
                            checked={settings.twoFactorAuth}
                            onChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Session Timeout (minutes)
                            </label>
                            <select
                                value={settings.sessionTimeout}
                                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                                className="w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={120}>2 hours</option>
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-end"
                >
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
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
                                Save Settings
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

function ToggleSetting({ label, description, checked, onChange }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer">
            <div>
                <div className="font-medium text-gray-900">{label}</div>
                <div className="text-sm text-gray-500">{description}</div>
            </div>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 rounded text-purple-600 focus:ring-purple-500"
            />
        </label>
    );
}
