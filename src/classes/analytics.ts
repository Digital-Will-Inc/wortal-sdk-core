import { config } from "../api";
import { AnalyticsEventData, IAnalyticsEvent } from "../interfaces/analytics";
import { debug } from "../utils/logger";

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
        if (config.session.platform === "gd") {
            // Analytics are not allowed on GD as of v1.6.10.
            return;
        }

        if (config.session.platform === "debug") {
            debug("Mock analytics event", this.data);
            return;
        }

        debug("Sending analytics event", this.data);
        const name = this.data.name;
        const features = this.data.features;
        const request = new XMLHttpRequest();
        request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ name, features }));
    }
}
