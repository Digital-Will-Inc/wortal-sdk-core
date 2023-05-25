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
    retryAttempts: number;

    constructor(data: AdInstanceData, retryAttempts: number = 3) {
        this.adData = {
            adUnitId: data.adUnitId,
            description: data.description
        };
        this.callbacks = {
            beforeAd: data.beforeAd,
            afterAd: data.afterAd,
            noFill: data.noFill,
        };
        this.retryAttempts = retryAttempts;
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
        let attempt: number = 0;

        const showAdFn = () => {
            (window as any).triggerWortalAd(
                this.adData.placementType,
                this.adData.adUnitId,
                this.adData.description,
                {
                    beforeAd: this.callbacks.beforeAd,
                    afterAd: this.callbacks.afterAd,
                    noShow: () => {
                        if (attempt < this.retryAttempts && this.adData.placementType !== "preroll") {
                            attempt++;
                            console.log("[Wortal] Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            showAdFn();
                        } else {
                            console.log("[Wortal] Exceeded retry attempts. Show failed.");
                            this.callbacks.noFill();
                        }
                    },
                    noBreak: () => {
                        if (attempt < this.retryAttempts&& this.adData.placementType !== "preroll") {
                            attempt++;
                            console.log("[Wortal] Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            showAdFn();
                        } else {
                            console.log("[Wortal] Exceeded retry attempts. Show failed.");
                            this.callbacks.noFill();
                        }
                    },
                    // Preroll ads on Wortal platform only take the adBreakDone callback.
                    adBreakDone: this.adData.placementType === "preroll" ?
                        this.callbacks.afterAd : () => console.log("[Wortal] AdBreakDone")
                }
            );
        };

        showAdFn();
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
        let attempt: number = 0;

        const showAdFn = () => {
            (window as any).triggerWortalAd(
                this.adData.placementType,
                this.adData.adUnitId,
                this.adData.description, {
                    beforeAd: this.callbacks.beforeAd,
                    afterAd: this.callbacks.afterAd,
                    adDismissed: this.callbacks.adDismissed,
                    adViewed: this.callbacks.adViewed,
                    noShow: () => {
                        if (attempt < this.retryAttempts) {
                            attempt++;
                            console.log("[Wortal] Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            showAdFn();
                        } else {
                            console.log("[Wortal] Exceeded retry attempts. Show failed.");
                            this.callbacks.noFill();
                        }
                    },
                    noBreak: () => {
                        if (attempt < this.retryAttempts) {
                            attempt++;
                            console.log("[Wortal] Ad not filled, retrying.. \n Retry attempt: " + attempt);
                            showAdFn();
                        } else {
                            console.log("[Wortal] Exceeded retry attempts. Show failed.");
                            this.callbacks.noFill();
                        }
                    },
                    // This needs to be called on Wortal platform to trigger the ad to be shown after it is filled.
                    beforeReward: function (showAdFn: Function) { showAdFn(); },
                    adBreakDone: () => console.log("[Wortal] AdBreakDone")
                });
        }

        showAdFn();
    };
}
