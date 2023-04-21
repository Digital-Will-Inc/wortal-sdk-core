import { AdInstanceData, PlacementType } from "../types/ad-instance";

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
    noFill: Function;
}

/** @hidden */
interface IAdInstance {
    show: Function;
}

/** @hidden */
class AdInstance implements IAdInstance {
    adData: AdData;
    callbacks: AdCallbacks;

    constructor(data: AdInstanceData) {
        this.adData = {
            adUnitId: data.adUnitId,
            description: data.description
        };
        this.callbacks = {
            beforeAd: data.beforeAd,
            afterAd: data.afterAd,
            noFill: data.noFill,
        };
    }

    show(): void { };
}

/** @hidden */
export class InterstitialAd extends AdInstance {
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
                noShow: this.callbacks.noFill,
                noBreak: this.callbacks.noFill,
                // Preroll ads on Wortal platform only take the adBreakDone callback.
                adBreakDone: this.adData.placementType === "preroll" ?
                    this.callbacks.afterAd : () => console.log("[Wortal] AdBreakDone")
            });
    };
}

/** @hidden */
export class RewardedAd extends AdInstance {
    constructor(data: AdInstanceData) {
        super(data);
        this.adData.placementType = 'reward';
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
                noShow: this.callbacks.noFill,
                noBreak: this.callbacks.noFill,
                adDismissed: this.callbacks.adDismissed,
                adViewed: this.callbacks.adViewed,
                // This needs to be called on Wortal platform to trigger the ad to be shown after it is filled.
                beforeReward: function (showAdFn: Function) { showAdFn(); },
                adBreakDone: () => console.log("[Wortal] AdBreakDone")
            });
    };
}
