/**
 * Firestore Service - Real-time Database Integration
 * ALL operations now use auth wrapper to prevent permission errors
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { withAuth, waitForAuth, onAuthChange } from './firebase-auth-wrapper';

// ==================== TYPES ====================
export interface Student {
    id: string;
    name: string;
    email: string;
    rollNo: string;
    branch: string;
    batch: number;
    cgpa: number;
    backlogs: number;
    phone?: string;
    skills?: string[];
    academicYear?: 1 | 2 | 3 | 4;
    resumeUrl?: string;
    profilePicture?: string;
    createdAt?: Date;
}

export interface Drive {
    id: string;
    companyName: string;
    logo?: string;
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
    rounds?: string[];
    applicants: number;
    createdAt?: Date;
    recruiterId?: string;
}

export interface Application {
    id: string;
    studentId: string;
    driveId: string;
    status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Selected' | 'Rejected';
    currentRound?: string;
    feedback?: string;
    appliedAt?: Date;
    updatedAt?: Date;
}

// Collection names
const COLLECTIONS = {
    STUDENTS: 'students',
    DRIVES: 'drives',
    APPLICATIONS: 'applications',
    AUDIT_LOGS: 'auditLogs'
};

// ==================== FIRESTORE STUDENTS ====================
export class FirestoreStudentService {
    static async getAll(): Promise<Student[]> {
        return withAuth(async () => {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.STUDENTS));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            })) as Student[];
        });
    }

    static async getById(id: string): Promise<Student | null> {
        return withAuth(async () => {
            const docRef = doc(db, COLLECTIONS.STUDENTS, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: docSnap.data().createdAt?.toDate()
                } as Student;
            }
            return null;
        });
    }

    static async getByEmail(email: string): Promise<Student | null> {
        return withAuth(async () => {
            const q = query(
                collection(db, COLLECTIONS.STUDENTS),
                where('email', '==', email)
            );
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) return null;

            const docData = querySnapshot.docs[0];
            return {
                id: docData.id,
                ...docData.data(),
                createdAt: docData.data().createdAt?.toDate()
            } as Student;
        });
    }

    static async create(student: Omit<Student, 'id' | 'createdAt'>): Promise<Student> {
        return withAuth(async () => {
            const docRef = await addDoc(collection(db, COLLECTIONS.STUDENTS), {
                ...student,
                createdAt: Timestamp.now()
            });

            console.log('[Firestore] Created student:', docRef.id);
            return {
                id: docRef.id,
                ...student,
                createdAt: new Date()
            };
        });
    }

    static async update(id: string, updates: Partial<Student>): Promise<Student | null> {
        return withAuth(async () => {
            const docRef = doc(db, COLLECTIONS.STUDENTS, id);
            await updateDoc(docRef, updates);
            return this.getById(id);
        });
    }

    static async delete(id: string): Promise<boolean> {
        return withAuth(async () => {
            await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
            return true;
        });
    }

    // Real-time listener with auth
    static subscribe(callback: (students: Student[]) => void): () => void {
        let unsubscribe: (() => void) | null = null;

        waitForAuth().then(user => {
            if (user) {
                unsubscribe = onSnapshot(collection(db, COLLECTIONS.STUDENTS), (snapshot) => {
                    const students = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate()
                    })) as Student[];
                    callback(students);
                });
            }
        });

        return () => unsubscribe?.();
    }
}

// ==================== FIRESTORE DRIVES ====================
export class FirestoreDriveService {
    static async getAll(): Promise<Drive[]> {
        return withAuth(async () => {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.DRIVES));
            const drives = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                deadline: doc.data().deadline?.toDate?.() || new Date(doc.data().deadline),
                createdAt: doc.data().createdAt?.toDate?.() || new Date()
            })) as Drive[];

            // Sort by createdAt descending
            return drives.sort((a, b) => {
                const dateA = a.createdAt?.getTime() || 0;
                const dateB = b.createdAt?.getTime() || 0;
                return dateB - dateA;
            });
        });
    }

    static async getActive(): Promise<Drive[]> {
        return withAuth(async () => {
            const q = query(
                collection(db, COLLECTIONS.DRIVES),
                where('status', '==', 'OPEN')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                deadline: doc.data().deadline?.toDate?.() || new Date(doc.data().deadline),
                createdAt: doc.data().createdAt?.toDate?.() || new Date()
            })) as Drive[];
        });
    }

    static async getById(id: string): Promise<Drive | null> {
        return withAuth(async () => {
            const docRef = doc(db, COLLECTIONS.DRIVES, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    deadline: docSnap.data().deadline?.toDate?.() || new Date(),
                    createdAt: docSnap.data().createdAt?.toDate?.() || new Date()
                } as Drive;
            }
            return null;
        });
    }

    static async create(drive: Omit<Drive, 'id' | 'createdAt' | 'applicants'>): Promise<Drive> {
        return withAuth(async () => {
            const driveData = {
                ...drive,
                deadline: drive.deadline instanceof Date
                    ? Timestamp.fromDate(drive.deadline)
                    : Timestamp.fromDate(new Date(drive.deadline)),
                applicants: 0,
                createdAt: Timestamp.now()
            };

            const docRef = await addDoc(collection(db, COLLECTIONS.DRIVES), driveData);

            console.log('[Firestore] Created drive:', docRef.id, drive.companyName);
            return {
                id: docRef.id,
                ...drive,
                applicants: 0,
                createdAt: new Date()
            };
        });
    }

    static async update(id: string, updates: Partial<Drive>): Promise<Drive | null> {
        return withAuth(async () => {
            const docRef = doc(db, COLLECTIONS.DRIVES, id);
            const updateData: any = { ...updates };

            if (updates.deadline) {
                updateData.deadline = updates.deadline instanceof Date
                    ? Timestamp.fromDate(updates.deadline)
                    : Timestamp.fromDate(new Date(updates.deadline));
            }

            await updateDoc(docRef, updateData);
            console.log('[Firestore] Updated drive:', id);
            return this.getById(id);
        });
    }

    static async delete(id: string): Promise<boolean> {
        return withAuth(async () => {
            await deleteDoc(doc(db, COLLECTIONS.DRIVES, id));
            console.log('[Firestore] Deleted drive:', id);
            return true;
        });
    }

    // Real-time listener with auth
    static subscribe(callback: (drives: Drive[]) => void): () => void {
        let unsubscribe: (() => void) | null = null;

        waitForAuth().then(user => {
            if (user) {
                unsubscribe = onSnapshot(collection(db, COLLECTIONS.DRIVES), (snapshot) => {
                    const drives = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        deadline: doc.data().deadline?.toDate?.() || new Date(doc.data().deadline),
                        createdAt: doc.data().createdAt?.toDate?.() || new Date()
                    })) as Drive[];

                    // Sort by createdAt descending
                    drives.sort((a, b) => {
                        const dateA = a.createdAt?.getTime() || 0;
                        const dateB = b.createdAt?.getTime() || 0;
                        return dateB - dateA;
                    });

                    callback(drives);
                });
            }
        });

        return () => unsubscribe?.();
    }
}

// ==================== FIRESTORE APPLICATIONS ====================
export class FirestoreApplicationService {
    static async getAll(): Promise<Application[]> {
        return withAuth(async () => {
            const querySnapshot = await getDocs(collection(db, COLLECTIONS.APPLICATIONS));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
            })) as Application[];
        });
    }

    static async getByStudentId(studentId: string): Promise<Application[]> {
        return withAuth(async () => {
            const q = query(
                collection(db, COLLECTIONS.APPLICATIONS),
                where('studentId', '==', studentId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
            })) as Application[];
        });
    }

    static async getByDriveId(driveId: string): Promise<Application[]> {
        return withAuth(async () => {
            const q = query(
                collection(db, COLLECTIONS.APPLICATIONS),
                where('driveId', '==', driveId)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
            })) as Application[];
        });
    }

    static async create(app: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Promise<Application> {
        return withAuth(async () => {
            const now = Timestamp.now();
            const docRef = await addDoc(collection(db, COLLECTIONS.APPLICATIONS), {
                ...app,
                appliedAt: now,
                updatedAt: now
            });

            console.log('[Firestore] Created application:', docRef.id);

            // Update drive applicant count
            try {
                const driveRef = doc(db, COLLECTIONS.DRIVES, app.driveId);
                const driveSnap = await getDoc(driveRef);
                if (driveSnap.exists()) {
                    await updateDoc(driveRef, {
                        applicants: (driveSnap.data().applicants || 0) + 1
                    });
                }
            } catch (e) {
                console.warn('[Firestore] Could not update applicant count:', e);
            }

            return {
                id: docRef.id,
                ...app,
                appliedAt: new Date(),
                updatedAt: new Date()
            };
        });
    }

    static async updateStatus(
        id: string,
        status: Application['status'],
        feedback?: string
    ): Promise<Application | null> {
        return withAuth(async () => {
            const docRef = doc(db, COLLECTIONS.APPLICATIONS, id);
            await updateDoc(docRef, {
                status,
                feedback,
                updatedAt: Timestamp.now()
            });

            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data(),
                    appliedAt: docSnap.data().appliedAt?.toDate?.() || new Date(),
                    updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date()
                } as Application;
            }
            return null;
        });
    }

    static async delete(id: string): Promise<boolean> {
        return withAuth(async () => {
            await deleteDoc(doc(db, COLLECTIONS.APPLICATIONS, id));
            return true;
        });
    }

    // Real-time listener with auth
    static subscribe(callback: (applications: Application[]) => void): () => void {
        let unsubscribe: (() => void) | null = null;

        waitForAuth().then(user => {
            if (user) {
                unsubscribe = onSnapshot(collection(db, COLLECTIONS.APPLICATIONS), (snapshot) => {
                    const applications = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        appliedAt: doc.data().appliedAt?.toDate?.() || new Date(),
                        updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
                    })) as Application[];
                    callback(applications);
                });
            }
        });

        return () => unsubscribe?.();
    }
}

// Re-export auth wrapper functions
export { waitForAuth, withAuth, onAuthChange } from './firebase-auth-wrapper';
