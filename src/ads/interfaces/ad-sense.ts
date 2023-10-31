import { AdType } from "../types/ad-type";
import { AdBreakStatus, PlacementType } from "../types/ad-sense-types";

/**
 * Params to pass to the adBreak function. This is used to display ads via AdSense.
 * @hidden
 */
export interface AdSense_AdBreakParams {
    type: PlacementType;
    name: string;
    beforeAd?: () => void;
    afterAd?: () => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    beforeReward?: (showAdFn: () => void) => void;
    adBreakDone: (placementInfo: AdSense_PlacementInfo) => void;
}

/**
 * Config for AdSense to display ads.
 * @hidden
 */
export interface AdSense_Config {
    clientID: string;
    hostID: string;
    channelID: string;
}

/**
 * Info about an ad placement returned from the AdSense adBreak API after an ad instance is called for. This is returned
 * whether the ad shows or not.
 * @hidden
 */
export interface AdSense_PlacementInfo {
    breakType: PlacementType;
    breakName: string;
    breakFormat: AdType;
    breakStatus: AdBreakStatus;
}
