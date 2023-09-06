import { Notification, ScheduledNotification } from "../classes/notification";
import { NotificationPayload, NotificationScheduleResult } from "../interfaces/notifications";
import { APIEndpoints } from "../types/wortal";
import { API_URL, WORTAL_API } from "../utils/config";
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
        if (!isValidString(payload.title)) {
            throw invalidParams(undefined, WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC, API_URL.NOTIFICATIONS_SCHEDULE_ASYNC);
        }

        if (!isValidString(payload.body)) {
            throw invalidParams(undefined, WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC, API_URL.NOTIFICATIONS_SCHEDULE_ASYNC);
        }

        if (platform === "facebook") {
            const notification = new Notification(payload);
            return notification.send();
        } else if (platform === "debug") {
            return {
                id: "1234567890",
                success: true,
            };
        } else {
            throw notSupported(undefined, WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC);
        }
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
    const url: string | undefined = _getHistoryURL_Facebook();

    if (platform === "debug") {
        return Promise.resolve([ScheduledNotification.mock("daily_reward"), ScheduledNotification.mock("resources_full"), ScheduledNotification.mock()]);
    } else if (platform !== "facebook") {
        return Promise.reject(notSupported(undefined, WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC));
    }

    if (url === undefined) {
        return Promise.reject(operationFailed("Failed to get notifications. ASID is not available. This can occur if this API is called before the SDK has finished initializing.",
            WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
            API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response: Response) => {
            debug(`getHistoryAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data: any) => {
                    reject(operationFailed(`Failed to get notifications. Request failed with status code: ${data.message || data.detail || "No message found, sorry."}`,
                        WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
                        API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC));
                });
            }
        }).then((data: any) => {
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
        }).catch((error: any) => {
            reject(operationFailed(`Failed to get notifications. Error: ${error}`,
                WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
                API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC));
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

    if (!isValidString(id)) {
        return Promise.reject(invalidParams(undefined, WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC, API_URL.NOTIFICATIONS_CANCEL_ASYNC));
    }

    if (platform === "debug") {
        return Promise.resolve(true);
    } else if (platform !== "facebook") {
        return Promise.reject(notSupported(undefined, WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC));
    }

    if (url === undefined) {
        return Promise.reject(operationFailed("Failed to cancel notification. ASID is not available. This can occur if this API is called before the SDK has finished initializing.",
            WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
            API_URL.NOTIFICATIONS_CANCEL_ASYNC));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({notification_id: id}),
        }).then((response: Response) => {
            debug(`cancelAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data: any) => {
                    reject(operationFailed(`Failed to cancel notification. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                        WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                        API_URL.NOTIFICATIONS_CANCEL_ASYNC));
                });
            }
        }).then((data: any) => {
            debug(`cancelAsync data: ${JSON.stringify(data)}`);
            resolve(data.success)
        }).catch((error: any) => {
            reject(operationFailed(`Failed to cancel notifications. Error: ${error}`,
                WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                API_URL.NOTIFICATIONS_CANCEL_ASYNC));
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

    if (platform === "debug") {
        return Promise.resolve(true);
    } else if (platform !== "facebook") {
        return Promise.reject(notSupported(undefined, WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC));
    }

    if (url === undefined) {
        return Promise.reject(operationFailed("Failed to cancel all notifications. ASID is not available. This can occur if this API is called before the SDK has finished initializing.",
            WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
            API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC));
    }

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: typeof label !== "undefined" ? JSON.stringify({label: label}) : undefined,
        }).then((response: Response) => {
            debug(`cancelAllAsync response: ${response.status}`);
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data: any) => {
                    reject(operationFailed(`Failed to cancel all notifications. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                        WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
                        API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC));
                });
            }
        }).then((data: any) => {
            debug(`cancelAllAsync data: ${JSON.stringify(data)}`);
            resolve(data.success);
        }).catch((error: any) => {
            reject(operationFailed(`Failed to cancel all notifications. Error: ${error}`,
                WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
                API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC));
        });
    });
}

function _getHistoryURL_Facebook(): string | undefined {
    if (typeof config.player.asid !== "string" || config.player.asid.length === 0) {
        return undefined;
    } else {
        return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}`;
    }
}

function _getCancelURL_Facebook(): string | undefined {
    if (typeof config.player.asid !== "string" || config.player.asid.length === 0) {
        return undefined;
    } else {
        return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}/cancel_notification`;
    }
}

function _getCancelAllURL_Facebook(): string | undefined {
    if (typeof config.player.asid !== "string" || config.player.asid.length === 0) {
        return undefined;
    } else {
        return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}/cancel_all_notifications`;
    }
}
