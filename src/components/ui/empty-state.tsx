/**
 * Empty State Component - Beautiful placeholders
 * Used when there's no data to display
 */
'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { GradientButton } from './gradient-button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    illustration?: ReactNode;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    illustration
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
            {illustration || (
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="inline-flex p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6"
                >
                    <Icon className="w-16 h-16 text-gray-400" />
                </motion.div>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
            </h3>

            <p className="text-gray-600 mb-6 max-w-md">
                {description}
            </p>

            {actionLabel && onAction && (
                <GradientButton
                    variant="primary"
                    onClick={onAction}
                >
                    {actionLabel}
                </GradientButton>
            )}
        </motion.div>
    );
}
