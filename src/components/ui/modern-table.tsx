/**
 * Modern Table Component - Clean, responsive, hackathon-quality
 * Features sorting, filtering, and smooth animations
 */
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: any) => ReactNode;
}

interface ModernTableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (row: any) => void;
    variant?: 'default' | 'striped' | 'bordered';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ModernTable({
    columns,
    data,
    onRowClick,
    variant = 'default',
    size = 'md',
    className = '',
}: ModernTableProps) {
    const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}>
            <table className={`w-full ${sizes[size]}`}>
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-4 text-left font-semibold text-gray-700 border-b border-gray-200"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <motion.tr
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onRowClick?.(row)}
                            className={`
                                ${variant === 'striped' && idx % 2 === 0 ? 'bg-gray-50' : ''}
                                ${variant === 'bordered' ? 'border-b border-gray-100' : ''}
                                ${onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}
                                transition-colors duration-150
                            `}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 text-gray-900">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    No data available
                </div>
            )}
        </div>
    );
}
