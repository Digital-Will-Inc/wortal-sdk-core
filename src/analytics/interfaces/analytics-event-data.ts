import { PlacementType } from "../../ads/types/ad-sense-types";
import { AdType } from "../../ads/types/ad-type";
import { Platform } from "../../session/types/session-types";
import { AnalyticsEventType } from "../types/analytics-event-type";

/**
 * Data about an analytics event. This includes the event type and the features that were sent with the event.
 * Each event type has a different set of features.
 * @hidden
 */
export interface AnalyticsEventData {
    name: AnalyticsEventType;
    features: object;
}

/**
 * Data sent with the AdCall event.
 * @hidden
 */
export interface EventData_AdCall {
    format: AdType;
    placement?: PlacementType;
    platform: Platform;
    playerID: string;
    gameID: string;
    playTimeAtCall: number;
    success: boolean;
    viewedRewarded?: boolean;
}
