import { NotificationPayload } from "../types/notification-payload";
import { NotificationScheduleResult } from "../types/notification-schedule-result";
import ScheduledNotification from "../models/scheduled-notification";
import Notification from "../models/notification";
import { invalidParams, notSupported, operationFailed } from "../utils/error-handler";
import { isValidString } from "../utils/validators";
import { config } from "./index";

/** @hidden */
const URL_PREFIX: string = "https://html5gameportal.com/api/v1/notification";

/**
 * Schedule a notification to be delivered to the player at a later time.
 * @example
 * Wortal.notifications.scheduleAsync({
 *    title: "Your energy is full!",
 *    body: "Come back and play again.",
 *    mediaURL: "https://example.com/image.png",
 *    label: "resources-full",
 *    scheduleInterval: 300 // 5 minutes
 * }).then((result) => {
 *   console.log(result.id);
 * });
 * @param payload Object defining the notification to be scheduled.
 * @returns {Promise<NotificationScheduleResult>} Promise that contains the result of the scheduled notification.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function scheduleAsync(payload: NotificationPayload): Promise<NotificationScheduleResult> {
    const platform = config.session.platform;

    return Promise.resolve().then(() => {
        if (platform !== "facebook") {
            return Promise.reject(notSupported("Notifications not supported on platform: " + platform, "notifications.scheduleAsync"));
        }
        if (!isValidString(payload.title)) {
            return Promise.reject(invalidParams("Title cannot be null or empty.", "notifications.scheduleAsync"));
        }
        if (!isValidString(payload.body)) {
            return Promise.reject(invalidParams("Body cannot be null or empty.", "notifications.scheduleAsync"));
        }

        const notification = new Notification(payload);
        return notification.send();
    });
}

/**
 * Gets the history of scheduled notifications for the past 30 days.
 * @example
 * Wortal.notifications.getHistoryAsync().then((notifications) => {
 *   notifications.forEach((notification) => {
 *   console.log(notification.id);
 *   console.log(notification.status);
 * });
 * @returns {Promise<ScheduledNotification[]>} Promise that contains an array of notifications scheduled.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function getHistoryAsync(): Promise<ScheduledNotification[]> {
    const platform = config.session.platform;
    const url: string = _getHistoryURL_Facebook();

    if (platform !== "facebook") {
        return Promise.reject(notSupported("Notifications not supported on platform: " + platform, "notifications.getHistoryAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                reject(operationFailed(`[Wortal] Failed to get notifications. Request failed with status code: ${response.status}.`, "notifications.getHistoryAsync"));
            }
        }).then(data => {
            const notifications = data["data"].map((notification: any) => {
                return new ScheduledNotification({
                    id: notification["notification_id"],
                    status: notification["status"],
                    createdTime: notification["schedule_date"],
                    ...(notification["label"] && {label: notification["label"]})
                });
            });
            resolve(notifications);
        }).catch(error => {
            reject(operationFailed(`[Wortal] Failed to get notifications. Error: ${error}`, "notifications.getHistoryAsync"));
        });
    });
}

/**
 * Cancels a scheduled notification.
 * @example
 * Wortal.notifications.cancelAsync("1234567890");
 * @param id ID of the notification to cancel.
 * @returns {Promise<boolean>} Promise that resolves true if the notification was cancelled successfully, false otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>INVALID_PARAM</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function cancelAsync(id: string): Promise<boolean> {
    const platform = config.session.platform;
    const url = _getCancelURL_Facebook();

    if (platform !== "facebook") {
        return Promise.reject(notSupported("Notifications not supported on platform: " + platform, "notifications.cancelAsync"));
    }
    if (!isValidString(id)) {
        return Promise.reject(invalidParams("ID cannot be null or empty.", "notifications.cancelAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({notification_id: id}),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                reject(operationFailed(`[Wortal] Failed to cancel notification. Request failed with status code: ${response.status}. \n Message: ${JSON.stringify(response.json())}`, "notifications.cancelAsync"));
            }
        }).then(data => {
            resolve(data.success)
        }).catch(error => {
            reject(operationFailed(`[Wortal] Failed to cancel notifications. Error: ${error}`, "notifications.cancelAsync"));
        });
    });
}

/**
 * Cancels all scheduled notifications.
 * @example
 * Wortal.notifications.cancelAllAsync();
 * @param label Optional label of the notification category to cancel. If this is used then only notifications with the
 * specified label will be cancelled.
 * @returns {Promise<boolean>} Promise that resolves true if all notifications were cancelled successfully, false otherwise.
 * @throws {ErrorMessage} See error.message for details.
 * <ul>
 * <li>NOT_SUPPORTED</li>
 * <li>OPERATION_FAILED</li>
 * </ul>
 */
export function cancelAllAsync(label?: string): Promise<boolean> {
    const platform = config.session.platform;
    const url = _getCancelAllURL_Facebook();

    if (platform !== "facebook") {
        return Promise.reject(notSupported("Notifications not supported on platform: " + platform, "notifications.cancelAllAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: typeof label !== "undefined" ? JSON.stringify({label: label}) : undefined,
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                reject(operationFailed(`[Wortal] Failed to cancel all notifications. Request failed with status code: ${response.status}. \n Message: ${JSON.stringify(response.json())}`, "notifications.cancelAllAsync"));
            }
        }).then(data => {
            resolve(data.success);
        }).catch(error => {
            reject(operationFailed(`[Wortal] Failed to cancel all notifications. Error: ${error}`, "notifications.cancelAllAsync"));
        });
    });
}

function _getHistoryURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}`;
}

function _getCancelURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}/cancel_notification`;
}

function _getCancelAllURL_Facebook(): string {
    return `${URL_PREFIX}/${config.session.gameId}/fb/${config.player.asid}/cancel_all_notifications`;
}
