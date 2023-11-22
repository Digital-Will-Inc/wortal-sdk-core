import { API_URL, API_ENDPOINTS, WORTAL_API } from "../../data/core-data";
import { operationFailed } from "../../errors/error-handler";
import Wortal from "../../index";
import { ScheduledNotification } from "../classes/scheduled-notification";
import { NotificationPayload } from "../interfaces/notification-payload";
import { NotificationScheduleResult } from "../interfaces/notification-schedule-result";
import { NotificationsBase } from "../notifications-base";

/**
 * Facebook implementation of Notifications API. This uses the Wortal API to proxy schedule A2U notifications on Facebook.
 * @hidden
 */
export class NotificationsFacebook extends NotificationsBase {
    protected cancelAllAsyncImpl(label?: string): Promise<boolean> {
        const url = this._getCancelAllURL();
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
            })
                .then(async (response: Response) => {
                    Wortal._log.debug(`cancelAllAsync response: ${response.status}`);
                    if (response.ok) {
                        return response.json();
                    } else {
                        const data = await response.json();
                        reject(operationFailed(`Failed to cancel all notifications. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                            WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
                            API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC));
                    }
                })
                .then((data: any) => {
                    Wortal._log.debug(`cancelAllAsync data: ${JSON.stringify(data)}`);
                    resolve(data.success);
                })
                .catch((error: any) => {
                    reject(operationFailed(`Failed to cancel all notifications. Error: ${error}`,
                        WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
                        API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC));
                });
        });
    }

    protected cancelAsyncImpl(id: string): Promise<boolean> {
        const url = this._getCancelURL();
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
            })
                .then(async (response: Response) => {
                    Wortal._log.debug(`cancelAsync response: ${response.status}`);
                    if (response.ok) {
                        return response.json();
                    } else {
                        const data = await response.json();
                        reject(operationFailed(`Failed to cancel notification. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                            WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                            API_URL.NOTIFICATIONS_CANCEL_ASYNC));
                    }
                })
                .then((data: any) => {
                    Wortal._log.debug(`cancelAsync data: ${JSON.stringify(data)}`);
                    resolve(data.success)
                })
                .catch((error: any) => {
                    reject(operationFailed(`Failed to cancel notifications. Error: ${error}`,
                        WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                        API_URL.NOTIFICATIONS_CANCEL_ASYNC));
                });
        });
    }

    protected getHistoryAsyncImpl(): Promise<ScheduledNotification[]> {
        const url: string | undefined = this._getHistoryURL();
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
            })
                .then(async (response: Response) => {
                    Wortal._log.debug(`getHistoryAsync response: ${response.status}`);
                    if (response.ok) {
                        return response.json();
                    } else {
                        const data = await response.json();
                        reject(operationFailed(`Failed to get notifications. Request failed with status code: ${data.message || data.detail || "No message found, sorry."}`,
                            WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
                            API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC));
                    }
                })
                .then((data: any) => {
                    Wortal._log.debug(`getHistoryAsync data: ${JSON.stringify(data)}`);
                    const notifications = data["data"].map((notification: any) => {
                        return new ScheduledNotification({
                            id: notification["notification_id"],
                            status: notification["status"],
                            createdTime: notification["schedule_date"],
                            ...(notification["label"] && {label: notification["label"]})
                        });
                    });
                    resolve(notifications);
                })
                .catch((error: any) => {
                    reject(operationFailed(`Failed to get notifications. Error: ${error}`,
                        WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
                        API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC));
                });
        });
    }

    protected scheduleAsyncImpl(payload: NotificationPayload): Promise<NotificationScheduleResult> {
        if (typeof payload.scheduleInterval === "undefined") {
            payload.scheduleInterval = 86400;
        }

        const url: string | undefined = this._getScheduleURL();
        const body: string = this._buildSchedulePayload(payload);
        Wortal._log.debug("Notification created with payload:", payload);

        if (typeof url === "undefined") {
            return Promise.reject(operationFailed("Failed to schedule notification. ASID is not defined. This can occur if this API is called before the SDK has finished initializing.",
                WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                API_URL.NOTIFICATIONS_SCHEDULE_ASYNC));
        }

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            })
                .then(async (response: Response) => {
                    Wortal._log.debug("Notification response:", response);
                    if (response.ok) {
                        return response.json();
                    } else {
                        const data = await response.json();
                        reject(operationFailed(`Failed to schedule notification. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                            WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                            API_URL.NOTIFICATIONS_SCHEDULE_ASYNC));
                    }
                })
                .then((data: any) => {
                    Wortal._log.debug("Notification response JSON:", data);
                    resolve({
                        id: data.notification_id,
                        success: data.success,
                    });
                })
                .catch((error: any) => {
                    reject(operationFailed(`Failed to schedule notification. Error: ${error}`,
                        WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                        API_URL.NOTIFICATIONS_SCHEDULE_ASYNC));
                });
        });
    }

    private _getScheduleURL(): string | undefined {
        if (typeof Wortal.player._internalPlayer.asid !== "string" || Wortal.player._internalPlayer.asid.length === 0) {
            return undefined;
        } else {
            return `${API_ENDPOINTS.NOTIFICATIONS}${Wortal.session._internalSession.gameID}/fb/${Wortal.player._internalPlayer.asid}`;
        }
    }

    private _getHistoryURL(): string | undefined {
        if (typeof Wortal.player._internalPlayer.asid !== "string" || Wortal.player._internalPlayer.asid.length === 0) {
            return undefined;
        } else {
            return `${API_ENDPOINTS.NOTIFICATIONS}${Wortal.session._internalSession.gameID}/fb/${Wortal.player._internalPlayer.asid}`;
        }
    }

    private _getCancelURL(): string | undefined {
        if (typeof Wortal.player._internalPlayer.asid !== "string" || Wortal.player._internalPlayer.asid.length === 0) {
            return undefined;
        } else {
            return `${API_ENDPOINTS.NOTIFICATIONS}${Wortal.session._internalSession.gameID}/fb/${Wortal.player._internalPlayer.asid}/cancel_notification`;
        }
    }

    private _getCancelAllURL(): string | undefined {
        if (typeof Wortal.player._internalPlayer.asid !== "string" || Wortal.player._internalPlayer.asid.length === 0) {
            return undefined;
        } else {
            return `${API_ENDPOINTS.NOTIFICATIONS}${Wortal.session._internalSession.gameID}/fb/${Wortal.player._internalPlayer.asid}/cancel_all_notifications`;
        }
    }

    private _buildSchedulePayload(schedulePayload: NotificationPayload): string {
        const body = {
            message: {
                title: schedulePayload.title,
                body: schedulePayload.body,
                ...schedulePayload.mediaURL && {media_url: schedulePayload.mediaURL}
            },
            ...schedulePayload.label && {label: schedulePayload.label},
            ...schedulePayload.scheduleInterval && {schedule_interval: schedulePayload.scheduleInterval},
        };

        return JSON.stringify(body);
    }

}
