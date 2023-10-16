import { PlacementType } from "../types/ads";

/** @hidden */
export interface AdData {
    placementType?: PlacementType;
    adUnitId: string;
    description: string;
    isValid?: boolean;
}

/** @hidden */
export interface AdCallbacks {
    beforeAd: () => void;
    afterAd: () => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    noFill: () => void;
    beforeReward?: (showAdFn: () => void) => void;
    adBreakDone?: (placementInfo?: unknown) => void;
}

/** @hidden */
export interface IAdInstance {
    show: () => void;
    logEvent: (success: boolean, viewedReward?: boolean) => void;
}

/** @hidden */
export interface AdInstanceData {
    placementType: PlacementType;
    adUnitId: string;
    description: string;
    beforeAd: () => void;
    afterAd: () => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    noFill: () => void;
}

/** @hidden */
export interface AdConfigData {
    isAdBlocked: boolean;
    hasPrerollShown: boolean;
    interstitialId: string;
    rewardedId: string;
    bannerId: string;
    adsCalled: number;
    adsShown: number;
}

/** @hidden */
export interface AdSenseConfig {
    clientID: string;
    hostID: string;
    channelID: string;
}

/** @hidden */
export interface FacebookAdUnitsResponse {
    ads: FacebookAdUnit[];
}

/** @hidden */
export interface FacebookAdUnit {
    display_format: string;
    placement_id: string;
}
