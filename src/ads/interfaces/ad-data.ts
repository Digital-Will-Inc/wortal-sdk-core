import { PlacementType } from "../types/ad-sense-types";
import { AdCallbacks } from "./ad-callbacks";

/**
 * Used to build an ad instance.
 * @hidden
 */
export interface AdInstanceData {
    placementType: PlacementType;
    adUnitId: string;
    description: string;
    callbacks: AdCallbacks;
}

/**
 * Data for the ad config. This is stored in the SDKConfig.
 * @hidden
 */
export interface AdConfigData {
    isAdBlocked: boolean;
    hasPrerollShown: boolean;
    interstitialId: string;
    rewardedId: string;
    bannerId: string;
    adsCalled: number;
    adsShown: number;
}
