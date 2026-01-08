/**
 * Lumos Landing Page with Integrated Login/Signup
 * No redirect - login directly on landing page
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Shield, Building2, ArrowRight, BarChart, Target, Lock, TrendingUp, Mail, User, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
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

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('lumos_user');
    if (user) {
      const userData = JSON.parse(user);
      const routes = {
        STUDENT: '/student/opportunities',
        ADMIN: '/admin/institutional',
        RECRUITER: '/recruiter/dashboard'
      };
      const targetRoute = routes[userData.role as keyof typeof routes];
      if (targetRoute) {
        router.replace(targetRoute);
      }
    }
  }, [router]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

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

      if (activeTab === 'signup') {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.name || 'User'
        });
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
      }

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

      const routes = {
        STUDENT: '/student/opportunities',
        ADMIN: '/admin/institutional',
        RECRUITER: '/recruiter/dashboard'
      };

      router.push(routes[selectedRole]);
    } catch (err: any) {
      console.error('Auth error:', err);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">

          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Lumos</h1>
                <p className="text-purple-200 text-sm">Campus Placement OS</p>
              </div>
            </motion.div>

            {/* Welcome Text */}
            <div>
              <h2 className="text-3xl font-bold mb-3">
                {activeTab === 'signin' ? 'Welcome Back!' : 'Get Started Free'}
              </h2>
              <p className="text-purple-100 text-lg">
                {activeTab === 'signin'
                  ? 'Your intelligent placement journey continues here.'
                  : 'Join the future of campus placements.'}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3">
              {[
                { icon: Sparkles, text: 'AI-Powered Insights' },
                { icon: BarChart, text: 'Real-Time Tracking' },
                { icon: Target, text: 'Smart Eligibility Check' },
                { icon: Lock, text: 'Complete Transparency' }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 hover:bg-white/15 transition-all"
                >
                  <feature.icon className="w-5 h-5 text-yellow-300" />
                  <span className="text-white/90">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
          >
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6 bg-white/10 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab('signin'); setSelectedRole(null); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'signin'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('signup'); setSelectedRole(null); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${activeTab === 'signup'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                Sign Up
              </button>
            </div>

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

                  {/* Student Card */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('STUDENT')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Student</div>
                          <div className="text-sm text-white/70">Track your placement journey</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>

                  {/* Placement Cell Card */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('ADMIN')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Placement Cell</div>
                          <div className="text-sm text-white/70">Manage institutional placements</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>

                  {/* Recruiter Card */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('RECRUITER')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">Recruiter</div>
                          <div className="text-sm text-white/70">Find verified campus talent</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="auth-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="text-white/70 hover:text-white text-sm mb-4"
                  >
                    ← Change role
                  </button>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {activeTab === 'signup' && (
                    <div>
                      <label className="block text-white/80 text-sm mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Please wait...' : (activeTab === 'signin' ? 'Sign In' : 'Sign Up')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 inset-x-0 text-center py-4 text-white/50 text-sm">
        Powered by AI • Real-Time Data • Complete Transparency
      </div>

      {/* Animation Styles */}
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
