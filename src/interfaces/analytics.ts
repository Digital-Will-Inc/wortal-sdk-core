import { AnalyticsEventType } from "../types/analytics";

/** @hidden */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}

/** @hidden */
export interface IAnalyticsEvent {
    send: Function;
}
