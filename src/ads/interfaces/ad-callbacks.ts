/**
 * Callbacks that are triggered by an ad instance. These are the callbacks exposed by the Wortal SDK, all platform
 * specific callbacks are handled internally and mapped to these.
 * @hidden
 */
export interface AdCallbacks {
    beforeAd: () => void;
    afterAd: () => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    noFill: () => void;
    beforeReward?: (showAdFn: () => void) => void;
    adBreakDone?: (placementInfo?: unknown) => void;
}


