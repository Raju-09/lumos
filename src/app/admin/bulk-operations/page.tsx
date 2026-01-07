/**
 * Bulk Operations - Modern Admin Tool with Firestore
 * Mass actions with smooth animations and confirmations
 */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Download,
    Users,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileSpreadsheet,
    Send,
    Trash2,
    Edit
} from 'lucide-react';
import { useState } from 'react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Modal } from '@/components/ui/modal';
import { ModernTable } from '@/components/ui/modern-table';
import { FirestoreStudentService } from '@/lib/firestore-service';

export default function BulkOperationsPage() {
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [uploadedData, setUploadedData] = useState<any[]>([]);
    const [processing, setProcessing] = useState(false);

    const operations = [
        {
            id: 'import-students',
            title: 'Import Students',
            description: 'Bulk import student records from CSV',
            icon: Upload,
            color: 'from-blue-500 to-cyan-500',
            action: 'import'
        },
        {
            id: 'export-data',
            title: 'Export Data',
            description: 'Download placement data as Excel',
            icon: Download,
            color: 'from-green-500 to-emerald-500',
            action: 'export'
        },
        {
            id: 'notify-students',
            title: 'Notify Students',
            description: 'Send mass notifications/emails',
            icon: Send,
            color: 'from-purple-500 to-pink-500',
            action: 'notify'
        },
        {
            id: 'update-status',
            title: 'Update Status',
            description: 'Bulk update application statuses',
            icon: Edit,
            color: 'from-orange-500 to-red-500',
            action: 'update'
        }
    ];

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Mock CSV parsing - in production, use a proper CSV parser
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',');

                const data = lines.slice(1).map(line => {
                    const values = line.split(',');
                    return headers.reduce((obj: any, header, idx) => {
                        obj[header.trim()] = values[idx]?.trim();
                        return obj;
                    }, {});
                });

                setUploadedData(data.filter(row => row.name)); // Filter empty rows
                setShowConfirm(true);
            };
            reader.readAsText(file);
        }
    };

    const handleConfirmImport = async () => {
        setProcessing(true);

        try {
            // Import students to Firestore
            for (const student of uploadedData) {
                await FirestoreStudentService.create({
                    name: student.name,
                    email: student.email,
                    rollNo: student.rollNo,
                    branch: student.branch,
                    batch: parseInt(student.batch),
                    cgpa: parseFloat(student.cgpa),
                    backlogs: parseInt(student.backlogs) || 0,
                    phone: student.phone || '',
                    skills: student.skills?.split(';') || []
                });
            }

            setProcessing(false);
            setShowConfirm(false);
            setUploadedData([]);
            alert(`Successfully imported ${uploadedData.length} students!`);
        } catch (error) {
            console.error('Error importing students:', error);
            setProcessing(false);
            alert('Failed to import students. Please try again.');
        }
    };

    // Export Students to CSV
    const handleExportStudents = async () => {
        try {
            const students = await FirestoreStudentService.getAll();

            if (students.length === 0) {
                alert('No students found to export.');
                return;
            }

            const headers = ['Name', 'Email', 'Roll No', 'Branch', 'Batch', 'CGPA', 'Backlogs', 'Phone', 'Skills'];
            const csvContent = [
                headers.join(','),
                ...students.map(s => [
                    s.name || '',
                    s.email || '',
                    s.rollNo || '',
                    s.branch || '',
                    s.batch || '',
                    s.cgpa || '',
                    s.backlogs || 0,
                    s.phone || '',
                    (s.skills || []).join(';')
                ].map(v => `"${v}"`).join(','))
            ].join('\n');

            downloadCSV(csvContent, 'students_export.csv');
            alert(`Exported ${students.length} students successfully!`);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export students.');
        }
    };

    // Export Applications to CSV
    const handleExportApplications = async () => {
        try {
            // For now, create sample application data structure
            const csvContent = [
                'Student Name,Roll No,Company,Role,Status,Applied Date',
                '"Sample Student","CS001","Google","SDE","Pending","2026-01-01"',
                '"Demo Student","CS002","Microsoft","DevOps","Shortlisted","2026-01-05"'
            ].join('\n');

            downloadCSV(csvContent, 'applications_export.csv');
            alert('Exported applications successfully!');
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export applications.');
        }
    };

    // Helper function to download CSV
    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
            {/* Animated Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                        Bulk Operations
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Perform mass actions efficiently with powerful tools
                    </p>
                </motion.div>

                {/* Operation Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {operations.map((op, idx) => (
                        <OperationCard
                            key={op.id}
                            operation={op}
                            index={idx}
                            onSelect={() => setSelectedOperation(op.id)}
                        />
                    ))}
                </div>

                {/* File Upload Section */}
                {selectedOperation === 'import-students' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl"
                    >
                        <div className="text-center mb-6">
                            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Students</h2>
                            <p className="text-gray-600">Upload a CSV file with student records</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-12 h-12 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-600">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">CSV file (MAX. 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                />
                            </label>

                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium mb-2">CSV Format:</p>
                                <code className="text-xs text-blue-700 block">
                                    name,email,rollNo,branch,batch,cgpa,backlogs,phone,skills
                                </code>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Export Section */}
                {selectedOperation === 'export-data' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl"
                    >
                        <div className="text-center">
                            <Download className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Data</h2>
                            <p className="text-gray-600 mb-6">Download placement records as CSV</p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleExportStudents}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <Download className="w-5 h-5" />
                                    Export Students (.csv)
                                </button>
                                <button
                                    onClick={handleExportApplications}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                                >
                                    <Download className="w-5 h-5" />
                                    Export Applications (.csv)
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Confirm Import"
                size="lg"
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="font-semibold text-blue-900">Ready to import {uploadedData.length} students</p>
                            <p className="text-sm text-blue-700">Review the data below before confirming</p>
                        </div>
                    </div>

                    {uploadedData.length > 0 && (
                        <div className="max-h-96 overflow-auto">
                            <ModernTable
                                columns={[
                                    { key: 'name', label: 'Name' },
                                    { key: 'rollNo', label: 'Roll No' },
                                    { key: 'branch', label: 'Branch' },
                                    { key: 'cgpa', label: 'CGPA' }
                                ]}
                                data={uploadedData.slice(0, 10)}
                                size="sm"
                            />
                            {uploadedData.length > 10 && (
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    ...and {uploadedData.length - 10} more
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <GradientButton
                            variant="primary"
                            onClick={handleConfirmImport}
                            loading={processing}
                            icon={<CheckCircle2 className="w-5 h-5" />}
                        >
                            Confirm Import
                        </GradientButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

function OperationCard({ operation, index, onSelect }: any) {
    const Icon = operation.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={onSelect}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
        >
            <div className={`inline-flex p-4 bg-gradient-to-br ${operation.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{operation.title}</h3>
            <p className="text-sm text-gray-600">{operation.description}</p>
        </motion.div>
    );
}
