/**
 * Notification and Communication Types
 */

export interface Notification {
    id: string;

    // Recipient
    userId: string;
    userRole: 'student' | 'admin' | 'recruiter';

    // Content
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;

    // Related Data
    relatedId?: string; // Drive ID, Application ID, etc.
    relatedType?: 'drive' | 'application' | 'announcement';
    actionUrl?: string;
    actionText?: string;

    // Status
    read: boolean;
    delivered: boolean;

    // Priority & Channels
    priority: 'high' | 'medium' | 'low';
    channels: NotificationChannel[];

    // Timestamps
    createdAt: Date;
    readAt?: Date;
    expiresAt?: Date;
}

export type NotificationType =
    | 'new_drive'
    | 'application_submitted'
    | 'status_update'
    | 'shortlisted'
    | 'test_scheduled'
    | 'interview_scheduled'
    | 'offer_received'
    | 'rejected'
    | 'deadline_reminder'
    | 'event_reminder'
    | 'announcement'
    | 'profile_incomplete'
    | 'achievement';

export type NotificationChannel =
    | 'in_app'
    | 'email'
    | 'whatsapp'
    | 'sms';

// Notification preferences
export interface NotificationPreferences {
    userId: string;
    channels: {
        newDrive: NotificationChannel[];
        statusUpdate: NotificationChannel[];
        deadlineReminder: NotificationChannel[];
        eventReminder: NotificationChannel[];
        announcements: NotificationChannel[];
    };
    quietHours: {
        enabled: boolean;
        start: string; // "22:00"
        end: string; // "08:00"
    };
    frequency: {
        digest: 'instant' | 'hourly' | 'daily' | 'weekly';
        batching: boolean;
    };
}

// Email template
export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string; // HTML
    variables: string[]; // e.g., ['studentName', 'companyName', 'date']
    category: 'invitation' | 'reminder' | 'update' | 'announcement';
    createdAt: Date;
    updatedAt: Date;
}

// Bulk communication
export interface BulkCommunication {
    id: string;
    type: 'email' | 'whatsapp' | 'sms';
    subject?: string;
    message: string;
    recipients: string[]; // User IDs
    recipientCount: number;
    filter?: {
        branch?: string[];
        batch?: number[];
        cgpaMin?: number;
        driveId?: string;
    };
    template?: string; // Template ID
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    sentCount: number;
    failedCount: number;
    scheduledAt?: Date;
    sentAt?: Date;
    createdBy: string;
    createdAt: Date;
}

// Event/Calendar
export interface CalendarEvent {
    id: string;

    // Event Details
    title: string;
    description?: string;
    type: EventType;

    // Related Data
    driveId?: string;
    companyName?: string;
    roundId?: string;

    // Timing
    startDate: Date;
    endDate?: Date;
    duration?: number; // In minutes
    allDay: boolean;

    // Location
    mode: 'online' | 'offline';
    location?: string;
    meetingLink?: string;

    // Participants
    participantType: 'all' | 'specific' | 'eligible';
    participants?: string[]; // User IDs
    estimatedParticipants?: number;

    // Reminders
    reminders: EventReminder[];

    // Metadata
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export type EventType =
    | 'pre_placement_talk'
    | 'test'
    | 'interview'
    | 'group_discussion'
    | 'deadline'
    | 'workshop'
    | 'orientation'
    | 'other';

export interface EventReminder {
    time: number; // Minutes before event
    sent: boolean;
    sentAt?: Date;
}
