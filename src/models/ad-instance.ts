import {AdInstanceData, PlacementType} from "../types/ad-instance";

/** @hidden */
interface AdData {
    placementType?: PlacementType;
    adUnitId: string;
    description: string;
}

/** @hidden */
interface AdCallbacks {
    beforeAd: Function;
    afterAd: Function;
    adDismissed?: Function;
    adViewed?: Function;
}

/** @hidden */
interface IAdInstance {
    show: Function;
}

class AdInstance {
    adData: AdData;
    callbacks: AdCallbacks;

    /** @hidden */
    constructor(data: AdInstanceData) {
        this.adData = {
            adUnitId: data.adUnitId,
            description: data.description
        };
        this.callbacks = {
            beforeAd: data.beforeAd,
            afterAd: data.afterAd,
        };
    }

    /**
     * Shows the ad instance.
     */
    show(): void {};
}

/**
 * Instance of an interstitial ad. Call show() after instantiating.
 */
export class InterstitialAd extends AdInstance {
    /** @hidden */
    constructor(data: AdInstanceData) {
        super(data);
        this.adData.placementType = data.placementType;
    }

    show(): void {
        (window as any).triggerWortalAd(
            this.adData.placementType,
            this.adData.adUnitId,
            this.adData.description, {
                beforeAd: this.callbacks.beforeAd,
                afterAd: this.callbacks.afterAd,
                noShow: this.callbacks.afterAd,
                noBreak: this.callbacks.afterAd,
                adBreakDone: this.adData.placementType === "preroll" ?
                    this.callbacks.afterAd : () => console.log("[Wortal] AdBreakDone")
            });
    };
}

/**
 * Instance of a rewarded ad. Call show() after instantiating.
 */
export class RewardedAd extends AdInstance {
    /** @hidden */
    constructor(data: AdInstanceData) {
        super(data);
        this.adData.placementType = PlacementType.REWARD;
        this.callbacks.adDismissed = data.adDismissed;
        this.callbacks.adViewed = data.adViewed;
    }

    show(): void {
        (window as any).triggerWortalAd(
            this.adData.placementType,
            this.adData.adUnitId,
            this.adData.description, {
                beforeAd: this.callbacks.beforeAd,
                afterAd: this.callbacks.afterAd,
                noShow: this.callbacks.afterAd,
                noBreak: this.callbacks.afterAd,
                adDismissed: this.callbacks.adDismissed,
                adViewed: this.callbacks.adViewed,
                beforeReward: function (showAdFn: Function) { showAdFn(); },
                adBreakDone: () => console.log("[Wortal] AdBreakDone")
            });
    };
}
