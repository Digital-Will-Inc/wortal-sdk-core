import {AnalyticsEventData, AnalyticsEventType} from "../types/analytics-event";

/** @hidden */
interface AnalyticsData {
    name: AnalyticsEventType;
    features: object;
}

/** @hidden */
interface IAnalyticsEvent {
    send: Function;
}

/**
 * Instance of an analytics events. Call send() after instantiating.
 */
export default class AnalyticsEvent implements IAnalyticsEvent {
    data: AnalyticsData;

    /** @hidden */
    constructor(event: AnalyticsEventData) {
        this.data = {
            name: event.name,
            features: event.features,
        };
    }

    /**
     * Sends the analytics event to Wombat.
     */
    send(): void {
        const name = this.data.name;
        const features = this.data.features;
        let request = new XMLHttpRequest();
        request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ name, features }));
    }
}
