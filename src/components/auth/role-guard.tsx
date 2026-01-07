"use client";

import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RoleGuard({
    children,
    allowedRoles,
}: {
    children: React.ReactNode;
    allowedRoles: ("STUDENT" | "ADMIN" | "RECRUITER")[];
}) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
            // Redirect to correct dashboard if trying to access wrong area
            if (user.role === "STUDENT") router.push("/student/opportunities");
            else if (user.role === "ADMIN") router.push("/admin/institutional");
            else if (user.role === "RECRUITER") router.push("/recruiter/dashboard");
        }
    }, [user, isAuthenticated, isLoading, router, allowedRoles]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
