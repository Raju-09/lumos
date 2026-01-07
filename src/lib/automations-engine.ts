/**
 * AI-Powered Automations Engine
 * Handles deadline reminders, eligibility notifications, and result announcements
 */

import { DriveService, StudentService, ApplicationService } from './data-service';

// ==================== TYPES ====================
export interface AutomationRule {
    id: string;
    name: string;
    type: 'deadline_reminder' | 'eligibility_notification' | 'result_announcement' | 'pending_application';
    enabled: boolean;
    schedule: 'hourly' | 'daily' | 'before_deadline';
    conditions: Record<string, any>;
    actions: string[];
    lastRun?: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'reminder' | 'alert' | 'announcement';
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    read: boolean;
    actionUrl?: string;
    createdAt: Date;
}

// ==================== AUTOMATION SERVICE ====================
export class AutomationService {
    /**
     * Check for drives closing within 24 hours and send reminders
     */
    static async checkDeadlineReminders(): Promise<number> {
        const drives = await DriveService.getActive();
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        let remindersSent = 0;

        for (const drive of drives) {
            const deadline = new Date(drive.deadline);

            // Check if deadline is within 24 hours
            if (deadline > now && deadline <= tomorrow) {
                // Get all students who haven't applied yet
                const students = await StudentService.getAll();
                const applications = await ApplicationService.getByDriveId(drive.id);
                const appliedStudentIds = new Set(applications.map(a => a.studentId));

                for (const student of students) {
                    if (!appliedStudentIds.has(student.id)) {
                        // Check eligibility
                        const isEligible = this.checkEligibility(student, drive);

                        if (isEligible) {
                            await this.sendNotification({
                                userId: student.id,
                                type: 'reminder',
                                title: '⏰ Deadline Approaching!',
                                message: `${drive.companyName} - ${drive.role} application closes in less than 24 hours. Apply now!`,
                                priority: 'urgent',
                                actionUrl: `/student/opportunities/${drive.id}`
                            });
                            remindersSent++;
                        }
                    }
                }
            }
        }

        return remindersSent;
    }

    /**
     * Check for eligible students who haven't applied
     */
    static async notifyEligibleStudents(): Promise<number> {
        const drives = await DriveService.getActive();
        const students = await StudentService.getAll();
        let notificationsSent = 0;

        for (const drive of drives) {
            const applications = await ApplicationService.getByDriveId(drive.id);
            const appliedStudentIds = new Set(applications.map(a => a.studentId));

            for (const student of students) {
                if (!appliedStudentIds.has(student.id)) {
                    const isEligible = this.checkEligibility(student, drive);

                    if (isEligible) {
                        // Check if we've already sent a notification for this drive
                        const existingNotifications = await this.getNotifications(student.id);
                        const alreadyNotified = existingNotifications.some(
                            n => n.message.includes(drive.companyName) && n.type === 'alert'
                        );

                        if (!alreadyNotified) {
                            await this.sendNotification({
                                userId: student.id,
                                type: 'alert',
                                title: '🎯 New Opportunity Match!',
                                message: `You're eligible for ${drive.companyName} - ${drive.role}. Package: ₹${drive.ctcMin}-${drive.ctcMax} LPA`,
                                priority: 'high',
                                actionUrl: `/student/opportunities/${drive.id}`
                            });
                            notificationsSent++;
                        }
                    }
                }
            }
        }

        return notificationsSent;
    }

    /**
     * Announce results when application statuses change
     */
    static async announceResults(): Promise<number> {
        const applications = await ApplicationService.getAll();
        let announcementsSent = 0;

        for (const app of applications) {
            // Check if status changed recently (within last hour)
            const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
            if (new Date(app.updatedAt) > hourAgo) {
                const drive = (await DriveService.getAll()).find(d => d.id === app.driveId);
                if (!drive) continue;

                let message = '';
                let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';

                switch (app.status) {
                    case 'Shortlisted':
                        message = `🎉 You've been shortlisted for ${drive.companyName} - ${drive.role}!`;
                        priority = 'high';
                        break;
                    case 'Interview Scheduled':
                        message = `📅 Interview scheduled for ${drive.companyName}. Check your calendar for details.`;
                        priority = 'urgent';
                        break;
                    case 'Selected':
                        message = `🎊 Congratulations! You've been selected by ${drive.companyName}!`;
                        priority = 'urgent';
                        break;
                    case 'Rejected':
                        message = `Unfortunately, your application to ${drive.companyName} was not successful. Keep applying!`;
                        priority = 'low';
                        break;
                }

                if (message) {
                    await this.sendNotification({
                        userId: app.studentId,
                        type: 'announcement',
                        title: 'Application Update',
                        message,
                        priority,
                        actionUrl: `/student/applications`
                    });
                    announcementsSent++;
                }
            }
        }

        return announcementsSent;
    }

    /**
     * Check student eligibility against drive criteria
     */
    private static checkEligibility(student: any, drive: any): boolean {
        // CGPA check
        if (student.cgpa < drive.eligibility.cgpaCutoff) return false;

        // Branch check
        if (!drive.eligibility.allowedBranches.includes(student.branch)) return false;

        // Backlogs check
        if (student.backlogs > drive.eligibility.maxBacklogs) return false;

        // Skills check (if required)
        if (drive.eligibility.requiredSkills?.length) {
            const hasRequiredSkills = drive.eligibility.requiredSkills.some((skill: string) =>
                student.skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
            );
            if (!hasRequiredSkills) return false;
        }

        return true;
    }

    /**
     * Send notification to user
     */
    private static async sendNotification(data: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<void> {
        const notification: Notification = {
            ...data,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            read: false,
            createdAt: new Date()
        };

        // Store in localStorage
        const key = `lumos_notifications_${data.userId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.unshift(notification);
        localStorage.setItem(key, JSON.stringify(existing.slice(0, 50))); // Keep last 50
    }

    /**
     * Get notifications for a user
     */
    private static async getNotifications(userId: string): Promise<Notification[]> {
        const key = `lumos_notifications_${userId}`;
        const stored = localStorage.getItem(key);
        if (!stored) return [];

        return JSON.parse(stored).map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt)
        }));
    }

    /**
     * Run all automations (to be called periodically)
     */
    static async runAllAutomations(): Promise<{
        deadlineReminders: number;
        eligibilityNotifications: number;
        resultAnnouncements: number;
    }> {
        const [deadlineReminders, eligibilityNotifications, resultAnnouncements] = await Promise.all([
            this.checkDeadlineReminders(),
            this.notifyEligibleStudents(),
            this.announceResults()
        ]);

        return {
            deadlineReminders,
            eligibilityNotifications,
            resultAnnouncements
        };
    }
}

// ==================== SCHEDULER (Browser-based) ====================
export class AutomationScheduler {
    private static intervals: NodeJS.Timeout[] = [];

    /**
     * Start all scheduled automations
     */
    static start(): void {
        // Run hourly checks
        const hourlyCheck = setInterval(async () => {
            console.log('[Automation] Running hourly checks...');
            await AutomationService.runAllAutomations();
        }, 60 * 60 * 1000); // Every hour

        // Run deadline checks more frequently (every 15 minutes)
        const deadlineCheck = setInterval(async () => {
            console.log('[Automation] Checking deadlines...');
            await AutomationService.checkDeadlineReminders();
        }, 15 * 60 * 1000); // Every 15 minutes

        this.intervals.push(hourlyCheck, deadlineCheck);

        // Run immediately on start
        AutomationService.runAllAutomations();
    }

    /**
     * Stop all scheduled automations
     */
    static stop(): void {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }
}

// ==================== EXPORT HELPERS ====================
export function getUnreadNotifications(userId: string): Promise<Notification[]> {
    const key = `lumos_notifications_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return Promise.resolve([]);

    return Promise.resolve(
        JSON.parse(stored)
            .filter((n: Notification) => !n.read)
            .map((n: any) => ({
                ...n,
                createdAt: new Date(n.createdAt)
            }))
    );
}

export function markNotificationAsRead(userId: string, notificationId: string): void {
    const key = `lumos_notifications_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return;

    const notifications = JSON.parse(stored);
    const notification = notifications.find((n: Notification) => n.id === notificationId);
    if (notification) {
        notification.read = true;
        localStorage.setItem(key, JSON.stringify(notifications));
    }
}
