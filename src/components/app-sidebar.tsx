"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Briefcase,
    UserCircle,
    FileText,
    LogOut,
    Settings,
    Bell
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface SidebarProps {
    type: "STUDENT" | "ADMIN" | "RECRUITER";
}

export function AppSidebar({ type }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const studentLinks = [
        { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/student/jobs", label: "Opportunities", icon: Briefcase },
        { href: "/student/profile", label: "My Profile", icon: UserCircle },
        { href: "/student/applications", label: "Applications", icon: FileText },
    ];

    const adminLinks = [
        { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/drives", label: "Drive Management", icon: Briefcase },
        { href: "/admin/students", label: "Student Database", icon: UserCircle },
        { href: "/admin/reports", label: "Reports", icon: FileText },
    ];

    const recruiterLinks = [
        { href: "/recruiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/recruiter/jobs", label: "My Drives", icon: Briefcase },
        { href: "/recruiter/candidates", label: "Candidates", icon: UserCircle },
    ];

    let links = studentLinks;
    if (type === "ADMIN") links = adminLinks;
    if (type === "RECRUITER") links = recruiterLinks;

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card/50 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col">
                {/* Logo Area */}
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                            <span className="text-lg font-bold text-white">L</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Lumos</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 py-6">
                    <nav className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="border-t p-4">
                    <div className="mb-4 flex items-center gap-3 rounded-lg border bg-background p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
                            <UserCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium leading-none">Account</p>
                            <p className="truncate text-xs text-muted-foreground mt-1">Manage Settings</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}
