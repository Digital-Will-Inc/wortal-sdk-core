import Wortal from "../../index";
import { NotificationData } from "../interfaces/notification-data";
import { NotificationStatus } from "../types/notifications-types";

/**
 * Notification that has been scheduled. May represent a notification that is currently scheduled, has been delivered
 * or has been cancelled.
 */
export class ScheduledNotification {
    private notificationData: NotificationData;

    /** @hidden */
    constructor(data: NotificationData) {
        Wortal._log.debug("ScheduledNotification created with data:", data);
        this.notificationData = data;
    }

    /**
     * Unique ID of the notification.
     */
    get id(): string {
        return this.notificationData.id;
    }

    /**
     * Current status of the notification.
     */
    get status(): NotificationStatus {
        return this.notificationData.status;
    }

    /**
     * Optional label for the notification.
     */
    get label(): string | undefined {
        return this.notificationData.label;
    }

    /**
     * Time the notification was created.
     */
    get createdTime(): string {
        return this.notificationData.createdTime;
    }

    /**
     * Creates a mock notification for debugging and testing purposes.
     * @hidden
     */
    static mock(label?: string): ScheduledNotification {
        const id = Math.floor(Math.random() * 1000000).toString();
        return new ScheduledNotification({
            id: id,
            status: "SCHEDULED",
            label: label || "mock_notification",
            createdTime: new Date().toISOString(),
        });
    }
}
