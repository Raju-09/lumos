"use client";

import React, { createContext, useContext, useState } from "react";
import { Drive } from "@/lib/data-service";

export interface Application {
    id: string;
    driveId: string;
    studentId: string;
    status: "Applied" | "Shortlisted" | "Rejected";
    appliedAt: string;
}

interface DataContextType {
    drives: Drive[];
    applications: Application[];
    applyToDrive: (driveId: string) => void;
    hasApplied: (driveId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [applications, setApplications] = useState<Application[]>([
        {
            id: "app_1",
            driveId: "d1", // Applied to Google initially
            studentId: "s1",
            status: "Shortlisted",
            appliedAt: new Date().toISOString()
        }
    ]);

    const applyToDrive = (driveId: string) => {
        // Prevent duplicate applications
        if (applications.some(app => app.driveId === driveId)) return;

        const newApp: Application = {
            id: `app_${Date.now()}`,
            driveId,
            studentId: "s1", // Hardcoded for demo
            status: "Applied",
            appliedAt: new Date().toISOString()
        };
        setApplications(prev => [...prev, newApp]);
    };

    const hasApplied = (driveId: string) => {
        return applications.some(app => app.driveId === driveId);
    }

    return (
        <DataContext.Provider value={{ drives, applications, applyToDrive, hasApplied }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
