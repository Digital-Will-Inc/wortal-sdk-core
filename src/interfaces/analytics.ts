import { AdType, PlacementType } from "../types/ads";
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

/** @hidden */
export interface AdCallEventData {
    format: AdType;
    placement?: PlacementType;
    playerID: string;
    gameID: string;
    playTimeAtCall: number;
    success: boolean;
    viewedRewarded?: boolean;
}
