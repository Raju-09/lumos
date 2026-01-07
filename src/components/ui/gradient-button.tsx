/**
 * Modern Gradient Button Component
 * Reusable button with gradient backgrounds and animations
 */
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
}

const gradients = {
  primary: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
  secondary: 'from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
  success: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
  danger: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      className={`
        bg-gradient-to-r ${gradients[variant]}
        text-white font-semibold rounded-xl
        ${sizes[size]}
        shadow-lg hover:shadow-xl
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}
