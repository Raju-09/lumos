"use client";

import { useAuth } from "@/context/auth-context";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { usePathname } from "next/navigation";
import { UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SiteHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('lumos_user') || '{}');
        if (userData.avatar) {
            setProfileImage(userData.avatar);
        }
    }, []);

    // Generate breadcrumb-like title
    const getPageTitle = () => {
        const parts = pathname.split("/").filter(Boolean);
        if (parts.length < 2) return "Dashboard";
        const page = parts[parts.length - 1];
        return page.charAt(0).toUpperCase() + page.slice(1);
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8">
            <div className="flex items-center gap-4">
                {/* Breadcrumb / Page Title */}
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <NotificationBell />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarImage src={profileImage || (user?.role === 'STUDENT' ? "/avatars/student.png" : "/avatars/admin.png")} alt={user?.name} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground font-semibold">
                                    {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span onClick={logout}>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
