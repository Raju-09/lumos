'use client';

import { motion } from 'framer-motion';
import { Lightbulb, AlertTriangle, TrendingUp, BookOpen, Target } from 'lucide-react';

interface GapAnalysisProps {
    missedOpportunities: number;
    reasons: {
        type: 'cgpa' | 'skills' | 'experience' | 'backlog';
        count: number;
        message: string;
    }[];
    suggestions: string[];
}

export function GapAnalysis({
    missedOpportunities = 3,
    reasons = [
        { type: 'cgpa', count: 2, message: 'CGPA 0.2 below cutoff' },
        { type: 'skills', count: 1, message: 'Missing React.js skill' },
    ],
    suggestions = [
        'Focus on improving CGPA this semester',
        'Complete React.js certification course',
        'Work on a full-stack project to gain experience',
    ],
}: GapAnalysisProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">Insights for You</h3>
                    <p className="text-xs text-muted-foreground">
                        AI-powered recommendations
                    </p>
                </div>
            </div>

            {/* Missed Opportunities Alert */}
            {missedOpportunities > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg mb-4"
                >
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                You missed {missedOpportunities} {missedOpportunities === 1 ? 'drive' : 'drives'} due to:
                            </p>
                            <ul className="space-y-1.5">
                                {reasons.map((reason, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="text-xs text-muted-foreground flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                                        <span>{reason.message}</span>
                                        <span className="text-red-500 font-medium">({reason.count})</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Improvement Suggestions */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Improvement Plan</span>
                </div>

                {suggestions.map((suggestion, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg hover:bg-green-500/10 transition-colors group cursor-pointer"
                    >
                        <div className="mt-0.5">
                            <div className="w-5 h-5 rounded-full border-2 border-green-500/30 flex items-center justify-center group-hover:border-green-500 transition-colors">
                                <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                                    {idx + 1}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                {suggestion}
                            </p>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-4 border-t border-border"
            >
                <button className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group">
                    <BookOpen className="w-4 h-4" />
                    <span>View Detailed Improvement Plan</span>
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="group-hover:text-primary"
                    >
                        →
                    </motion.span>
                </button>
            </motion.div>
        </motion.div>
    );
}
