import { config } from "../api";
import {
    INotification,
    NotificationData,
    NotificationPayload,
    NotificationScheduleResult
} from "../interfaces/notifications";
import { NotificationStatus } from "../types/notifications";
import { APIEndpoints } from "../types/wortal";
import { operationFailed } from "../utils/error-handler";
import { debug } from "../utils/logger";

/** @hidden */
export class Notification implements INotification {
    schedulePayload: NotificationPayload;

    constructor(payload: NotificationPayload) {
        this.schedulePayload = {
            title: payload.title,
            body: payload.body,
            ...payload.mediaURL && {mediaURL: payload.mediaURL},
            ...payload.label && {label: payload.label},
            ...payload.scheduleInterval ? {scheduleInterval: payload.scheduleInterval} : {scheduleInterval: 86400}
        };
       debug("Notification created with payload:", this.schedulePayload);
    }

    send(): Promise<NotificationScheduleResult> {
        debug("Sending notification...");
        const url: string | undefined = this.getScheduleURL_Facebook();
        const body: string = this.buildSchedulePayload_Facebook();

        if (typeof url === "undefined") {
            return Promise.reject(operationFailed("Failed to schedule notification. ASID is not defined.",
                "notifications.scheduleAsync",
                "https://sdk.html5gameportal.com/api/notifications/#scheduleasync"));
        }

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            }).then(response => {
                debug("Notification response:", response);
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((data) => {
                        reject(operationFailed(`Failed to schedule notification. Request failed with status code: ${response.status}. \n Message: ${data.message || data.detail || "No message found, sorry."}`,
                            "notifications.scheduleAsync",
                            "https://sdk.html5gameportal.com/api/notifications/#scheduleasync"));
                    });
                }
            }).then(response => {
                debug("Notification response JSON:", response);
                resolve({
                    id: response.notification_id,
                    success: response.success,
                });
            }).catch(error => {
                reject(operationFailed(`Failed to schedule notification. Error: ${error}`,
                    "notifications.scheduleAsync",
                    "https://sdk.html5gameportal.com/api/notifications/#scheduleasync"));
            });
        });
    }

    buildSchedulePayload_Facebook(): string {
        const body = {
            message: {
                title: this.schedulePayload.title,
                body: this.schedulePayload.body,
                ...this.schedulePayload.mediaURL && {media_url: this.schedulePayload.mediaURL}
            },
            ...this.schedulePayload.label && {label: this.schedulePayload.label},
            ...this.schedulePayload.scheduleInterval && {schedule_interval: this.schedulePayload.scheduleInterval},
        };

        return JSON.stringify(body);
    }

    getScheduleURL_Facebook(): string | undefined {
        if (typeof config.player.asid !== "string" || config.player.asid.length === 0) {
            return undefined;
        } else {
            return `${APIEndpoints.NOTIFICATIONS}${config.session.gameId}/fb/${config.player.asid}`;
        }
    }
}

/**
 * Notification that has been scheduled.
 */
export class ScheduledNotification {
    private notificationData: NotificationData;

    /** @hidden */
    constructor(data: NotificationData) {
        debug("ScheduledNotification created with data:", data);
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
}
