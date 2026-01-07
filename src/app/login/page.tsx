/**
 * Modern Hackathon-Winning Login/Signup
 * Features: Gradients, Glassmorphism, Smart Auth, Animations
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Building2, Sparkles, ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

type AuthMode = 'login' | 'signup';
type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export default function ModernAuthPage() {
    const [mode, setMode] = useState<AuthMode>('login');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        rollNumber: '',
        academicYear: 4 as 1 | 2 | 3 | 4
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedRole) {
            setError('Please select a role');
            return;
        }

        setLoading(true);

        try {
            let userCredential;

            if (mode === 'signup') {
                // Create new user
                userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                // Update profile with display name
                await updateProfile(userCredential.user, {
                    displayName: formData.name || 'User'
                });
            } else {
                // Sign in existing user
                userCredential = await signInWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );
            }

            // Store user role in localStorage (you can also use Firestore for this)
            const userData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: userCredential.user.displayName || formData.name,
                role: selectedRole,
                rollNumber: formData.rollNumber || formData.email,
                academicYear: selectedRole === 'STUDENT' ? formData.academicYear : undefined,
                loginTime: new Date().toISOString()
            };

            localStorage.setItem('lumos_user', JSON.stringify(userData));

            // Redirect to role-specific dashboard
            const routes = {
                STUDENT: '/student/opportunities',
                ADMIN: '/admin/institutional',
                RECRUITER: '/recruiter/dashboard'
            };

            router.push(routes[selectedRole]);
        } catch (err: any) {
            console.error('Auth error:', err);

            // User-friendly error messages
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please login instead.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Invalid credentials. Please check your email and password.');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center"
                >
                    {/* Left Side - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white space-y-6 hidden md:block"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
                                    <Sparkles className="w-8 h-8 text-yellow-300" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-bold">Lumos</h1>
                                    <p className="text-purple-200">Campus Placement OS</p>
                                </div>
                            </motion.div>

                            <h2 className="text-3xl font-semibold">
                                {mode === 'login' ? 'Welcome Back!' : 'Get Started Free'}
                            </h2>

                            <p className="text-purple-100 text-lg">
                                {mode === 'login'
                                    ? 'Your intelligent placement journey continues here.'
                                    : 'Join the future of campus placements. AI-powered, transparent, efficient.'}
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className="space-y-3">
                            {[
                                { icon: '✨', text: 'AI-Powered Insights' },
                                { icon: '📊', text: 'Real-Time Tracking' },
                                { icon: '🎯', text: 'Smart Eligibility Check' },
                                { icon: '🔒', text: 'Complete Transparency' }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + idx * 0.1 }}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                    <span className="text-white/90">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Auth Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                    >
                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl">
                            <button
                                onClick={() => setMode('login')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${mode === 'login'
                                    ? 'bg-white text-purple-600 shadow-lg'
                                    : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={`flex-1 py-2 rounded-lg font-medium transition-all ${mode === 'signup'
                                    ? 'bg-white text-purple-600 shadow-lg'
                                    : 'text-white/70 hover:text-white'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Role Selection */}
                        <AnimatePresence mode="wait">
                            {!selectedRole ? (
                                <motion.div
                                    key="role-select"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-3"
                                >
                                    <p className="text-white/80 text-sm mb-4">Select your role to continue</p>
                                    <RoleButton
                                        icon={Users}
                                        title="Student"
                                        subtitle="Track your placement journey"
                                        onClick={() => setSelectedRole('STUDENT')}
                                    />
                                    <RoleButton
                                        icon={Shield}
                                        title="Placement Cell"
                                        subtitle="Manage institutional placements"
                                        onClick={() => setSelectedRole('ADMIN')}
                                    />
                                    <RoleButton
                                        icon={Building2}
                                        title="Recruiter"
                                        subtitle="Find verified campus talent"
                                        onClick={() => setSelectedRole('RECRUITER')}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="auth-form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    {/* Selected Role Badge */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2 text-white">
                                            {selectedRole === 'STUDENT' && <Users className="w-5 h-5" />}
                                            {selectedRole === 'ADMIN' && <Shield className="w-5 h-5" />}
                                            {selectedRole === 'RECRUITER' && <Building2 className="w-5 h-5" />}
                                            <span className="font-medium capitalize">{selectedRole}</span>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRole(null)}
                                            className="text-white/60 hover:text-white text-sm"
                                        >
                                            Change
                                        </button>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {mode === 'signup' && (
                                            <InputField
                                                icon={User}
                                                type="text"
                                                placeholder="Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        )}

                                        <InputField
                                            icon={Mail}
                                            type="email"
                                            placeholder={selectedRole === 'STUDENT' ? 'College Email' : 'Work Email'}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />

                                        {selectedRole === 'STUDENT' && mode === 'signup' && (
                                            <>
                                                <InputField
                                                    icon={User}
                                                    type="text"
                                                    placeholder="Roll Number"
                                                    value={formData.rollNumber}
                                                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                                    required
                                                />

                                                <div className="space-y-2">
                                                    <label className="text-white/80 text-sm">Academic Year</label>
                                                    <select
                                                        value={formData.academicYear}
                                                        onChange={(e) => setFormData({ ...formData, academicYear: parseInt(e.target.value) as 1 | 2 | 3 | 4 })}
                                                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                                                        required
                                                    >
                                                        <option value="1" className="bg-purple-900">1st Year</option>
                                                        <option value="2" className="bg-purple-900">2nd Year</option>
                                                        <option value="3" className="bg-purple-900">3rd Year</option>
                                                        <option value="4" className="bg-purple-900">4th Year</option>
                                                    </select>
                                                </div>
                                            </>
                                        )}

                                        <InputField
                                            icon={Lock}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            rightIcon={showPassword ? EyeOff : Eye}
                                            onRightIconClick={() => setShowPassword(!showPassword)}
                                        />

                                        {mode === 'login' && (
                                            <div className="text-right">
                                                <button type="button" className="text-sm text-white/70 hover:text-white">
                                                    Forgot password?
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                                                </>
                                            ) : (
                                                <>
                                                    {mode === 'login' ? 'Continue' : 'Create Account'}
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Demo Mode */}
                                    <div className="mt-6 text-center">
                                        <p className="text-white/50 text-xs mb-2">For demo purposes</p>
                                        <button
                                            type="button"
                                            className="text-sm text-white/80 hover:text-white underline"
                                        >
                                            🎮 Explore as Demo User
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 inset-x-0 text-center py-4 text-white/50 text-sm">
                Powered by AI • Real-Time Data • Complete Transparency
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}

function RoleButton({ icon: Icon, title, subtitle, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-left transition-all hover:scale-105 hover:shadow-lg group"
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <div className="font-semibold text-white">{title}</div>
                    <div className="text-sm text-white/70">{subtitle}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/50 ml-auto group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    );
}

function InputField({ icon: Icon, rightIcon: RightIcon, onRightIconClick, ...props }: any) {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
                {...props}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl py-3 pl-11 pr-11 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
            {RightIcon && (
                <button
                    type="button"
                    onClick={onRightIconClick}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                    <RightIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
