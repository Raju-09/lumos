"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    timestamp: string;
    link?: string;
}

interface NotificationContextType {
    notifications: Notification[];
    markAsRead: (id: string) => void;
    addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "n1",
            title: "Welcome to Lumos",
            message: "Complete your profile to unlock all features.",
            type: "info",
            read: false,
            timestamp: new Date().toISOString()
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notif: Omit<Notification, "id" | "read" | "timestamp">) => {
        const newNotif: Notification = {
            id: `n_${Date.now()}`,
            read: false,
            timestamp: new Date().toISOString(),
            ...notif
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    // Real-time Drive Notifications
    useEffect(() => {
        const lastCheckedRef = { current: new Date() }; // Use a ref to persist across renders without triggering them

        import("@/lib/firestore-service").then(({ FirestoreDriveService }) => {
            const unsubscribe = FirestoreDriveService.subscribe((drives: any[]) => { // Using any[] temporarily to avoid type issues if imports fail, but logically Drive[]
                const newDrives = drives.filter(d => {
                    const created = new Date(d.createdAt);
                    return created > lastCheckedRef.current;
                });

                newDrives.forEach(drive => {
                    addNotification({
                        title: `New Drive: ${drive.companyName}`,
                        message: `${drive.role} applications are now open!`,
                        type: "success",
                        link: `/student/jobs?search=${encodeURIComponent(drive.companyName)}`
                    });
                });

                if (newDrives.length > 0) {
                    // Update last checked to the most recent drive's creation time to avoid duplicate alerts
                    lastCheckedRef.current = new Date();
                }
            });
            return () => unsubscribe();
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, markAsRead, addNotification, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return context;
}
