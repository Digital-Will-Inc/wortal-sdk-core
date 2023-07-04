import { AnalyticsEventData, IAnalyticsEvent } from "../interfaces/analytics";

/** @hidden */
export class AnalyticsEvent implements IAnalyticsEvent {
    data: AnalyticsEventData;

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
