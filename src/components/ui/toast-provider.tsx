'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        const toast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const config = {
        success: {
            icon: CheckCircle2,
            className: 'bg-green-50 border-green-200 text-green-800',
            iconClassName: 'text-green-600'
        },
        error: {
            icon: XCircle,
            className: 'bg-red-50 border-red-200 text-red-800',
            iconClassName: 'text-red-600'
        },
        warning: {
            icon: AlertCircle,
            className: 'bg-orange-50 border-orange-200 text-orange-800',
            iconClassName: 'text-orange-600'
        },
        info: {
            icon: Info,
            className: 'bg-blue-50 border-blue-200 text-blue-800',
            iconClassName: 'text-blue-600'
        }
    };

    const { icon: Icon, className, iconClassName } = config[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${className}`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClassName}`} />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
