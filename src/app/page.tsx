/**
 * QUICK FIX: Force correct login from root page
 * Prevents role mismatch issues
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('lumos_user');

    if (user) {
      const userData = JSON.parse(user);

      // Force correct routing based on role
      const routes = {
        student: '/student/opportunities',
        admin: '/admin/institutional',
        recruiter: '/recruiter/dashboard'
      };

      const targetRoute = routes[userData.role as keyof typeof routes];
      if (targetRoute) {
        router.replace(targetRoute);
      } else {
        // Invalid role, force re-login
        localStorage.removeItem('lumos_user');
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
      <div className="text-white text-xl">Loading Lumos...</div>
    </div>
  );
}
