/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree
 */
'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GradientButton } from '../ui/gradient-button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-red-200 shadow-2xl text-center">
                        <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
                            <AlertTriangle className="w-12 h-12 text-red-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-gray-600 mb-6">
                            An unexpected error occurred. Don't worry, we've logged it and will fix it soon.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <p className="text-xs font-mono text-red-800 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <GradientButton
                            variant="danger"
                            icon={RefreshCw}
                            onClick={this.handleReset}
                            fullWidth
                        >
                            Try Again
                        </GradientButton>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
