import { NotificationStatus } from "../types/notifications-types";

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
