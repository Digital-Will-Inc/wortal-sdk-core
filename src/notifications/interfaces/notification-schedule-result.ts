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
