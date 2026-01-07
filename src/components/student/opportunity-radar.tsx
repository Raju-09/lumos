'use client';

import { motion } from 'framer-motion';
import { Radar, Clock, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface OpportunityRadarProps {
    eligibleCount: number;
    urgentCount: number;  // < 24 hours
    highPayingCount: number; // > 10 LPA
}

export function OpportunityRadar({
    eligibleCount = 5,
    urgentCount = 2,
    highPayingCount = 3,
}: OpportunityRadarProps) {
    const maxDrives = 20; // For progress bar calculation
    const progress = (eligibleCount / maxDrives) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl p-6 hover-lift"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Radar className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Opportunity Radar</h3>
            </div>

            {/* Main Count */}
            <div className="text-center mb-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.2
                    }}
                    className="relative inline-flex items-center justify-center"
                >
                    <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <div className="relative text-5xl font-bold text-primary">
                        {eligibleCount}
                    </div>
                </motion.div>
                <p className="text-sm text-muted-foreground mt-2">
                    Drives you're eligible for
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="relative bg-muted h-2 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
                        style={{
                            animation: 'shimmer 3s infinite linear'
                        }}
                    />
                </div>
            </div>

            {/* Highlights */}
            <div className="space-y-3 mb-6">
                {urgentCount > 0 && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                    >
                        <Clock className="w-4 h-4 text-red-500 animate-pulse-slow" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                {urgentCount} closing in &lt;24 hours
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Apply now before deadline!
                            </p>
                        </div>
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </motion.div>
                )}

                {highPayingCount > 0 && (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                {highPayingCount} high-paying (&gt;10 LPA)
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Premium opportunities available
                            </p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </motion.div>
                )}
            </div>

            {/* CTA Button */}
            <Link href="/student/opportunities">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-primary text-white py-3 px-4 rounded-lg font-medium 
                     hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                    <span>View All Opportunities</span>
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.span>
                </motion.button>
            </Link>
        </motion.div>
    );
}
