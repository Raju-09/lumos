/**
 * Animated Stat Box Component
 * Modern stat display with gradients and animations
 */
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatBoxProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'pink';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorSchemes = {
  blue: {
    bg: 'from-blue-500 to-indigo-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
  },
  green: {
    bg: 'from-green-500 to-emerald-600',
    light: 'bg-green-50',
    text: 'text-green-600',
  },
  orange: {
    bg: 'from-orange-500 to-red-600',
    light: 'bg-orange-50',
    text: 'text-orange-600',
  },
  purple: {
    bg: 'from-purple-500 to-indigo-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
  },
  pink: {
    bg: 'from-pink-500 to-purple-600',
    light: 'bg-pink-50',
    text: 'text-pink-600',
  },
};

export function AnimatedStatBox({ icon: Icon, label, value, color, trend }: AnimatedStatBoxProps) {
  const scheme = colorSchemes[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br ${scheme.bg}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
