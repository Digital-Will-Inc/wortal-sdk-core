import { Notification, ScheduledNotification } from "../classes/notification";
import { NotificationPayload, NotificationScheduleResult } from "../interfaces/notifications";
import { APIEndpoints } from "../types/wortal";
import { invalidParams, notSupported, operationFailed } from "../utils/error-handler";
import { debug } from "../utils/logger";
import { isValidString } from "../utils/validators";
import { config } from "./index";

/**
 * Schedule a notification to be delivered to the player at a later time. Limit of 5 pending scheduled notifications per recipient.
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
            return Promise.reject(notSupported(`Notifications not supported on platform: ${platform}`, "notifications.scheduleAsync"));
        }
        if (!isValidString(payload.title)) {
            return Promise.reject(invalidParams("title cannot be null or empty. Please provide a valid string for the payload.title property.", "notifications.scheduleAsync"));
        }
        if (!isValidString(payload.body)) {
            return Promise.reject(invalidParams("body cannot be null or empty. Please provide a valid string for the payload.body property.", "notifications.scheduleAsync"));
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
        return Promise.reject(notSupported(`Notifications not supported on platform: ${platform}`, "notifications.getHistoryAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            debug(`getHistoryAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data) => {
                    reject(operationFailed(`Failed to get notifications. Request failed with status code: ${data.message || data.detail || "No message found, sorry."}`, "notifications.getHistoryAsync"));
                });
            }
        }).then(data => {
            debug(`getHistoryAsync data: ${JSON.stringify(data)}`);
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
            reject(operationFailed(`Failed to get notifications. Error: ${error}`, "notifications.getHistoryAsync"));
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
        return Promise.reject(notSupported(`Notifications not supported on platform: ${platform}`, "notifications.cancelAsync"));
    }
    if (!isValidString(id)) {
        return Promise.reject(invalidParams("id cannot be null or empty. Please provide a valid string for the id parameter.", "notifications.cancelAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({notification_id: id}),
        }).then(response => {
            debug(`cancelAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data) => {
                    reject(operationFailed(`Failed to cancel notification. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`, "notifications.cancelAsync"));
                });
            }
        }).then(data => {
            debug(`cancelAsync data: ${JSON.stringify(data)}`);
            resolve(data.success)
        }).catch(error => {
            reject(operationFailed(`Failed to cancel notifications. Error: ${error}`, "notifications.cancelAsync"));
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
        return Promise.reject(notSupported(`Notifications not supported on platform: ${platform}`, "notifications.cancelAllAsync"));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: typeof label !== "undefined" ? JSON.stringify({label: label}) : undefined,
        }).then(response => {
            debug(`cancelAllAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data) => {
                    reject(operationFailed(`Failed to cancel all notifications. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`, "notifications.cancelAllAsync"));
                });
            }
        }).then(data => {
            debug(`cancelAllAsync data: ${JSON.stringify(data)}`);
            resolve(data.success);
        }).catch(error => {
            reject(operationFailed(`Failed to cancel all notifications. Error: ${error}`, "notifications.cancelAllAsync"));
        });
    });
}

function _getHistoryURL_Facebook(): string {
    return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}`;
}

function _getCancelURL_Facebook(): string {
    return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}/cancel_notification`;
}

function _getCancelAllURL_Facebook(): string {
    return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}/cancel_all_notifications`;
}
