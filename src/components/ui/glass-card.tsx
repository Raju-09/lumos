/**
 * Glassmorphism Card Component
 * Modern card with backdrop blur and transparency
 */
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, shadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      onClick={onClick}
      className={`
        bg-white/80 backdrop-blur-xl
        border border-white/20
        rounded-2xl shadow-xl
        ${hover ? 'cursor-pointer transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
