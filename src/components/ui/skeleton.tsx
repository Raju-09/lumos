import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-gray-200', className)}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
            <div className="divide-y divide-gray-200">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="p-4 flex gap-4">
                        <Skeleton className="h-10 w-1/4" />
                        <Skeleton className="h-10 w-1/4" />
                        <Skeleton className="h-10 w-1/4" />
                        <Skeleton className="h-10 w-1/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}
