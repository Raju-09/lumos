/**
 * Data Service Layer - Centralized data management
 * REAL FIRESTORE INTEGRATION with Auth Protection
 */

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { withAuth, waitForAuth } from './firebase-auth-wrapper';
import { LiveJob, fetchAggregatedJobs } from './live-jobs-api';

// ==================== TYPES ====================
export interface Student {
    id: string; // Firestore ID
    name: string;
    email: string;
    rollNo: string;
    branch: string;
    batch: number;
    cgpa: number;
    backlogs: number;
    phone: string;
    skills: string[];
    academicYear?: 1 | 2 | 3 | 4;
    resumeUrl?: string;
    profilePicture?: string;
    createdAt: Date;
}

export interface Drive {
    id: string; // Firestore ID
    companyName: string;
    logo: string;
    role: string;
    type: 'Full-Time' | 'Internship' | 'Contract';
    ctcMin: number;
    ctcMax: number;
    location: string[];
    deadline: Date;
    status: 'OPEN' | 'CLOSED' | 'UPCOMING';
    eligibleYears?: number[];
    eligibility: {
        cgpaCutoff: number;
        allowedBranches: string[];
        maxBacklogs: number;
        requiredSkills?: string[];
    };
    rounds: string[];
    applicants: number;
    createdAt: Date;
}

export interface Application {
    id: string;
    studentId: string;
    driveId: string;
    status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
    currentRound: string;
    feedback?: string;
    appliedAt: Date;
    updatedAt: Date;
}

// ==================== STUDENTS ====================
export class StudentService {
    private static collectionRef = collection(db, 'students');

    static async getAll(): Promise<Student[]> {
        return withAuth(async () => {
            const snapshot = await getDocs(this.collectionRef);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date()
            })) as Student[];
        });
    }

    static async getById(id: string): Promise<Student | null> {
        try {
            const all = await this.getAll();
            return all.find(s => s.id === id) || null;
        } catch (e) {
            console.error("Error fetching student", e);
            return null;
        }
    }

    static async getByEmail(email: string): Promise<Student | null> {
        const q = query(this.collectionRef, where("email", "==", email));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return {
            id: doc.id,
            ...doc.data(),
            createdAt: (doc.data().createdAt as Timestamp).toDate()
        } as Student;
    }

    static async create(student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
        // Check if exists
        const existing = await this.getByEmail(student.email);
        if (existing) return existing;

        const newStudentData = {
            ...student,
            createdAt: Timestamp.now()
        };

        const docRef = await addDoc(this.collectionRef, newStudentData);

        return {
            id: docRef.id,
            ...student,
            createdAt: new Date()
        };
    }

    static async update(id: string, updates: Partial<Student>): Promise<Student | null> {
        const docRef = doc(db, 'students', id);
        await updateDoc(docRef, updates);
        return this.getById(id);
    }
}

// ==================== DRIVES ====================
export class DriveService {
    private static collectionRef = collection(db, 'drives');

    static async getAll(): Promise<Drive[]> {
        const q = query(this.collectionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                deadline: data.deadline ? (data.deadline as Timestamp).toDate() : new Date(),
                createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date()
            };
        }) as Drive[];
    }

    static async getActive(): Promise<Drive[]> {
        const all = await this.getAll();
        return all.filter(d => d.status === 'OPEN');
    }

    static async create(drive: Omit<Drive, 'id' | 'createdAt' | 'applicants'>): Promise<Drive> {
        const newDriveData = {
            ...drive,
            applicants: 0,
            createdAt: Timestamp.now(),
            deadline: Timestamp.fromDate(drive.deadline)
        };

        const docRef = await addDoc(this.collectionRef, newDriveData);

        return {
            id: docRef.id,
            ...drive,
            applicants: 0,
            createdAt: new Date()
        };
    }

    static async update(id: string, updates: Partial<Drive>): Promise<Drive | null> {
        const docRef = doc(db, 'drives', id);
        if (updates.deadline) {
            // @ts-ignore
            updates.deadline = Timestamp.fromDate(updates.deadline);
        }
        await updateDoc(docRef, updates);

        const all = await this.getAll();
        return all.find(d => d.id === id) || null;
    }

    static async delete(id: string): Promise<boolean> {
        await deleteDoc(doc(db, 'drives', id));
        return true;
    }
}

// ==================== APPLICATIONS ====================
export class ApplicationService {
    private static collectionRef = collection(db, 'applications');

    static async getAll(): Promise<Application[]> {
        const snapshot = await getDocs(this.collectionRef);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                appliedAt: (data.appliedAt as Timestamp).toDate(),
                updatedAt: (data.updatedAt as Timestamp).toDate()
            };
        }) as Application[];
    }

    static async getByStudentId(studentId: string): Promise<Application[]> {
        const q = query(this.collectionRef, where("studentId", "==", studentId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            appliedAt: (doc.data().appliedAt as Timestamp).toDate(),
            updatedAt: (doc.data().updatedAt as Timestamp).toDate()
        })) as Application[];
    }

    static async create(app: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Promise<Application> {
        const newApp = {
            ...app,
            appliedAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        const docRef = await addDoc(this.collectionRef, newApp);

        // Update drive applicant count (Optimistic)
        const drive = (await DriveService.getAll()).find(d => d.id === app.driveId);
        if (drive) {
            await DriveService.update(drive.id, { applicants: (drive.applicants || 0) + 1 });
        }

        return {
            id: docRef.id,
            ...app,
            appliedAt: new Date(),
            updatedAt: new Date()
        };
    }

    static async updateStatus(id: string, status: Application['status'], feedback?: string): Promise<Application | null> {
        const docRef = doc(db, 'applications', id);
        await updateDoc(docRef, {
            status,
            feedback,
            updatedAt: Timestamp.now()
        });

        const apps = await this.getAll();
        return apps.find(a => a.id === id) || null;
    }

    static async deleteByStudentId(studentId: string): Promise<void> {
        const apps = await this.getByStudentId(studentId);
        apps.forEach(async app => await deleteDoc(doc(db, 'applications', app.id)));
    }

    static async deleteByDriveId(driveId: string): Promise<void> {
        const q = query(this.collectionRef, where("driveId", "==", driveId));
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(async d => await deleteDoc(doc(db, 'applications', d.id)));
    }
}

// ==================== LIVE JOBS & ANALYTICS ====================
export class JobsService {
    static async search(query: string): Promise<LiveJob[]> {
        return await fetchAggregatedJobs(query);
    }
}

export class AnalyticsService {
    static async getPlacementStats() {
        try {
            const [students, drives, applications] = await Promise.all([
                StudentService.getAll(),
                DriveService.getAll(),
                ApplicationService.getAll()
            ]);

            const placedStudents = new Set(
                applications
                    .filter(a => a.status === 'Selected')
                    .map(a => a.studentId)
            ).size;

            return {
                totalStudents: students.length,
                totalDrives: drives.length,
                placementRate: students.length > 0 ? (placedStudents / students.length) * 100 : 0,
                avgPackage: 0,
                topCompanies: []
            };
        } catch (error) {
            console.error("Analytics Error", error);
            return {
                totalStudents: 0,
                totalDrives: 0,
                placementRate: 0,
                avgPackage: 0,
                topCompanies: []
            };
        }
    }
}

export async function initializeSampleData() {
    console.log("Firestore Mode: Sample data init skipped.");
}
