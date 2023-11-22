import { ScheduledNotification } from "../classes/scheduled-notification";
import { NotificationPayload } from "../interfaces/notification-payload";
import { NotificationScheduleResult } from "../interfaces/notification-schedule-result";
import { NotificationsBase } from "../notifications-base";

/**
 * Debug implementation of Notifications API. This implementation does not schedule any notifications, but instead
 * logs them to the console to help with debugging and testing implementations.
 * @hidden
 */
export class NotificationsDebug extends NotificationsBase {
    protected cancelAllAsyncImpl(label?: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    protected cancelAsyncImpl(id: string): Promise<boolean> {
        return Promise.resolve(true);
    }

    protected getHistoryAsyncImpl(): Promise<ScheduledNotification[]> {
        return Promise.resolve([ScheduledNotification.mock("daily_reward"), ScheduledNotification.mock("resources_full"), ScheduledNotification.mock()]);
    }

    protected scheduleAsyncImpl(payload: NotificationPayload): Promise<NotificationScheduleResult> {
        const result: NotificationScheduleResult = {
            id: "1234567890",
            success: true,
        };

        return Promise.resolve(result);
    }

}
