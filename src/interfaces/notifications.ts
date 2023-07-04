import { NotificationStatus } from "../types/notifications";

/**
 * Payload used to send notifications to a recipient.
 */
export interface NotificationPayload {
    /**
     * The title of the notification.
     */
    title: string;
    /**
     * The body of the notification.
     */
    body: string;
    /**
     * URL to the icon of the notification. Defaults to game icon on Wortal if not provided.
     */
    mediaURL?: string;
    /**
     * Label used to categorize notifications.
     */
    label?: string;
    /**
     * Time from now (in seconds) to send the notification. Limited between 300 (5 minutes) and 6480000 (75 days).
     * Limit of 5 pending scheduled notifications per recipient. Default is 1 day (86400 seconds).
     */
    scheduleInterval?: number;
}

/**
 * Data about a scheduled notification.
 */
export interface NotificationData {
    /**
     * The ID of the notification.
     */
    id: string;
    /**
     * Status of the notification.
     */
    status: NotificationStatus;
    /**
     * Label for the notification category.
     */
    label?: string;
    /**
     * Time the notification was scheduled on. This is not the time the notification will be sent on.
     */
    createdTime: string;
}

/**
 * Result of a scheduled notification.
 */
export interface NotificationScheduleResult {
    /**
     * ID of the scheduled notification.
     */
    id: string;
    /**
     * Whether the notification was scheduled successfully.
     */
    success: boolean;
}

/** @hidden */
export interface INotification {
    send: Function;
}
