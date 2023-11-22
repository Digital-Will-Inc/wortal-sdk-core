import { API_URL, WORTAL_API } from "../data/core-data";
import { invalidParams, notInitialized } from "../errors/error-handler";
import { ValidationResult } from "../errors/interfaces/validation-result";
import Wortal from "../index";
import { isValidString } from "../utils/validators";
import { ScheduledNotification } from "./classes/scheduled-notification";
import { NotificationPayload } from "./interfaces/notification-payload";
import { NotificationScheduleResult } from "./interfaces/notification-schedule-result";

/**
 * Base class for Notifications API. Extend this class to implement the Notifications API for a specific platform.
 * @hidden
 */
export abstract class NotificationsBase {
    constructor() {
    }

//#region Public API

    public cancelAllAsync(label?: string): Promise<boolean> {
        Wortal._log.apiCall(WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC);

        const validationResult: ValidationResult = this.validateCancelAllAsync(label);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.cancelAllAsyncImpl(label);
    }

    public cancelAsync(id: string): Promise<boolean> {
        Wortal._log.apiCall(WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC);

        const validationResult: ValidationResult = this.validateCancelAsync(id);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.cancelAsyncImpl(id);
    }

    public getHistoryAsync(): Promise<ScheduledNotification[]> {
        Wortal._log.apiCall(WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC);

        const validationResult: ValidationResult = this.validateGetHistoryAsync();
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.getHistoryAsyncImpl();
    }

    public scheduleAsync(payload: NotificationPayload): Promise<NotificationScheduleResult> {
        Wortal._log.apiCall(WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC);

        const validationResult: ValidationResult = this.validateScheduleAsync(payload);
        if (!validationResult.valid) {
            return Promise.reject(validationResult.error);
        }

        return this.scheduleAsyncImpl(payload);
    }

//#endregion
//#region Implementation interface

    protected abstract cancelAllAsyncImpl(label?: string): Promise<boolean>;
    protected abstract cancelAsyncImpl(id: string): Promise<boolean>;
    protected abstract getHistoryAsyncImpl(): Promise<ScheduledNotification[]>;
    protected abstract scheduleAsyncImpl(payload: NotificationPayload): Promise<NotificationScheduleResult>;

//#endregion
//#region Validation

    protected validateCancelAllAsync(label?: string): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.NOTIFICATIONS_CANCEL_ALL_ASYNC,
                    API_URL.NOTIFICATIONS_CANCEL_ALL_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateCancelAsync(id: string): ValidationResult {
        if (!isValidString(id)) {
            return {
                valid: false,
                error: invalidParams(undefined,
                    WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                    API_URL.NOTIFICATIONS_CANCEL_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.NOTIFICATIONS_CANCEL_ASYNC,
                    API_URL.NOTIFICATIONS_CANCEL_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateGetHistoryAsync(): ValidationResult {
        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.NOTIFICATIONS_GET_HISTORY_ASYNC,
                    API_URL.NOTIFICATIONS_GET_HISTORY_ASYNC),
            };
        }

        return { valid: true };
    }

    protected validateScheduleAsync(payload: NotificationPayload): ValidationResult {
        if (!isValidString(payload.title)) {
            return {
                valid: false,
                error: invalidParams("title",
                    WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                    API_URL.NOTIFICATIONS_SCHEDULE_ASYNC),
            };
        }

        if (!isValidString(payload.body)) {
            return {
                valid: false,
                error: invalidParams("body",
                    WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                    API_URL.NOTIFICATIONS_SCHEDULE_ASYNC),
            };
        }

        if (!Wortal.isInitialized) {
            return {
                valid: false,
                error: notInitialized(undefined,
                    WORTAL_API.NOTIFICATIONS_SCHEDULE_ASYNC,
                    API_URL.NOTIFICATIONS_SCHEDULE_ASYNC),
            };
        }

        return { valid: true };
    }

//#endregion
}
