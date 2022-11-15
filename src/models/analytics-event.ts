import { AnalyticsEventData, AnalyticsEventType } from "../types/analytics-event";

/** @hidden */
interface AnalyticsData {
    name: AnalyticsEventType;
    features: object;
}

/** @hidden */
interface IAnalyticsEvent {
    send: Function;
}

/** @hidden */
export default class AnalyticsEvent implements IAnalyticsEvent {
    data: AnalyticsData;

    constructor(event: AnalyticsEventData) {
        this.data = {
            name: event.name,
            features: event.features,
        };
    }

    send(): void {
        const name = this.data.name;
        const features = this.data.features;
        let request = new XMLHttpRequest();
        request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ name, features }));
    }
}
