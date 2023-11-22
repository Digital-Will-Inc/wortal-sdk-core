import Wortal from "../../index";
import { AnalyticsEventData } from "../interfaces/analytics-event-data";

/**
 * Analytics event that is sent to the Wombat backend.
 * @hidden
 */
export class WombatEvent {
    private readonly _data: AnalyticsEventData;

    constructor(event: AnalyticsEventData) {
        this._data = {
            name: event.name,
            features: event.features,
        };
    }

    send(): void {
        Wortal._log.debug("Sending analytics event to Wombat", this._data);
        const name = this._data.name;
        const features = this._data.features;
        const request = new XMLHttpRequest();
        request.open("POST", "https://wombat.digitalwill.co.jp/wortal/events");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ name, features }));
    }
}
