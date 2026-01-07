'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'yellow' | 'green' | 'purple';
    onClick?: () => void;
}

const colorMap = {
    blue: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-500',
        border: 'border-blue-500/20',
        gradient: 'from-blue-500/20 to-blue-500/0',
    },
    yellow: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-500',
        border: 'border-yellow-500/20',
        gradient: 'from-yellow-500/20 to-yellow-500/0',
    },
    green: {
        bg: 'bg-green-500/10',
        text: 'text-green-500',
        border: 'border-green-500/20',
        gradient: 'from-green-500/20 to-green-500/0',
    },
    purple: {
        bg: 'bg-purple-500/10',
        text: 'text-purple-500',
        border: 'border-purple-500/20',
        gradient: 'from-purple-500/20 to-purple-500/0',
    },
};

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    onClick
}: StatCardProps) {
    const colors = colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`
        relative overflow-hidden bg-card border ${colors.border} rounded-xl p-6 
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        transition-all
      `}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-50`} />

            {/* Content */}
            <div className="relative">
                {/* Icon and Trend */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 ${colors.bg} rounded-lg`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>

                    {trend && (
                        <div className={`
              text-xs font-medium px-2 py-1 rounded-full
              ${trend.isPositive
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : 'bg-red-500/10 text-red-600 dark:text-red-400'
                            }
            `}>
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </div>
                    )}
                </div>

                {/* Value */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-2"
                >
                    <div className="text-3xl font-bold">
                        {typeof value === 'number' ? (
                            <CountUpAnimation value={value} />
                        ) : (
                            value
                        )}
                    </div>
                </motion.div>

                {/* Title */}
                <div className="text-sm text-muted-foreground">
                    {title}
                </div>
            </div>

            {/* Hover Effect */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0`}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}

// Count-up animation for numbers
function CountUpAnimation({ value }: { value: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1000; // 1 second
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
}

import { useEffect, useState } from 'react';
