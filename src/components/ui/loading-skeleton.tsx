/**
 * Loading Skeleton Component - Smooth placeholder animations
 */
'use client';

interface LoadingSkeletonProps {
    variant?: 'text' | 'circle' | 'rect' | 'card';
    count?: number;
    className?: string;
}

export function LoadingSkeleton({
    variant = 'rect',
    count = 1,
    className = '',
}: LoadingSkeletonProps) {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]';

    const variants = {
        text: `h-4 w-full rounded ${baseClasses}`,
        circle: `w-12 h-12 rounded-full ${baseClasses}`,
        rect: `h-32 w-full rounded-lg ${baseClasses}`,
        card: `h-48 w-full rounded-xl ${baseClasses}`,
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={variants[variant]} />
            ))}
        </div>
    );
}
