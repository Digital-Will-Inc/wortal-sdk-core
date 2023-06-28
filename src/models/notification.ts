import { config } from "../api";
import { NotificationPayload } from "../types/notification-payload";
import { NotificationScheduleResult } from "../types/notification-schedule-result";
import { operationFailed } from "../utils/error-handler";

/** @hidden */
interface INotification {
    send: Function;
}

/** @hidden */
export default class Notification implements INotification {
    schedulePayload: NotificationPayload;

    constructor(payload: NotificationPayload) {
        this.schedulePayload = {
            title: payload.title,
            body: payload.body,
            ...payload.mediaURL && {mediaURL: payload.mediaURL},
            ...payload.label && {label: payload.label},
            ...payload.scheduleInterval ? {scheduleInterval: payload.scheduleInterval} : {scheduleInterval: 86400}
        };
    }

    send(): Promise<NotificationScheduleResult> {
        const url: string = this.getScheduleURL_Facebook();
        const body: string = this.buildSchedulePayload_Facebook();

        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body,
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject(operationFailed(`[Wortal] Failed to schedule notification. Request failed with status code: ${response.status}. \n Message: ${JSON.stringify(response.json())}`, "notifications.scheduleAsync"));
                }
            }).then(response => {
                resolve({
                    id: response.notification_id,
                    success: response.success,
                });
            }).catch(error => {
                reject(operationFailed(`[Wortal] Failed to schedule notification. Error: ${error}`, "notifications.scheduleAsync"));
            });
        });
    }

    buildSchedulePayload_Facebook(): string {
        let body = {
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

    getScheduleURL_Facebook(): string {
        return `https://html5gameportal.com/api/v1/notification/${config.session.gameId}/fb/${config.player.asid}`;
    }
}
