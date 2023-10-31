import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { ScheduledNotification } from "../classes/scheduled-notification";
import { NotificationPayload } from "../interfaces/notification-payload";
import { NotificationScheduleResult } from "../interfaces/notification-schedule-result";
import { NotificationsBase } from "../notifications-base";

/**
 * CrazyGames implementation of Notifications API.
 * @hidden
 */
export class NotificationsCrazyGames extends NotificationsBase {
    constructor() {
        super();
    }

    protected cancelAllAsyncImpl(label?: string): Promise<boolean> {
        throw notSupported(undefined, WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC, API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC);
    }

    protected cancelAsyncImpl(id: string): Promise<boolean> {
        throw notSupported(undefined, WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC, API_URL.NOTIFICATIONS_CANCEL_ASYNC);
    }

    protected getHistoryAsyncImpl(): Promise<ScheduledNotification[]> {
        throw notSupported(undefined, WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC, API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC);
    }

    protected scheduleAsyncImpl(payload: NotificationPayload): Promise<NotificationScheduleResult> {
        throw notSupported(undefined, WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC, API_URL.NOTIFICATIONS_SCHEDULE_ASYNC);
    }

}