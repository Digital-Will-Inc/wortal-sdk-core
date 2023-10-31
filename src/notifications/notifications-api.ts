import { ScheduledNotification } from "./classes/scheduled-notification";
import { NotificationPayload } from "./interfaces/notification-payload";
import { NotificationScheduleResult } from "./interfaces/notification-schedule-result";
import { NotificationsBase } from "./notifications-base";

/**
 * The Notifications API provides a way to schedule notifications to be delivered to the player at a later time.
 * Notifications can be used to inform the player of events that occur in the game, such as when a building is finished
 * constructing or when a player has been attacked. Notifications can be scheduled to be delivered at a specific time or
 * at a specific interval. Notifications can also be cancelled if they are no longer needed. The Notifications API is
 * only available on Android and iOS devices.
 * @module Notifications
 */
export class NotificationsAPI {
    private _notifications: NotificationsBase;

    constructor(impl: NotificationsBase) {
        this._notifications = impl;
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
    public cancelAllAsync(label?: string): Promise<boolean> {
        return this._notifications.cancelAllAsync(label);
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
    public cancelAsync(id: string): Promise<boolean> {
        return this._notifications.cancelAsync(id);
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
    public getHistoryAsync(): Promise<ScheduledNotification[]> {
        return this._notifications.getHistoryAsync();
    }

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
    public scheduleAsync(payload: NotificationPayload): Promise<NotificationScheduleResult> {
        return this._notifications.scheduleAsync(payload);
    }
}
