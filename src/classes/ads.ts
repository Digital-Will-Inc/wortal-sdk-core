import { config } from "../api";
import { AdCallbacks, AdConfigData, AdData, AdInstanceData, IAdInstance } from "../interfaces/ads";
import { rethrowPlatformError } from "../utils/error-handler";

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

/** @hidden */
export class AdConfig {
    private _current: AdConfigData = {
        isAdBlocked: false,
        hasPrerollShown: false,
        interstitialId: "",
        rewardedId: "",
    };

    constructor() {
        const platform = config.session.platform;
        if (platform === "link" || platform === "viber") {
            this._setLinkViberAdUnitIds();
        } else if (platform === "facebook") {
            this._setFacebookAdUnitIds();
        } else {
            console.log("[Wortal] AdConfig initialized: ", this._current);
        }
    }

    get isAdBlocked(): boolean {
        return this._current.isAdBlocked;
    }

    setAdBlocked(isBlocked: boolean): void {
        this._current.isAdBlocked = isBlocked;
    }

    get hasPrerollShown(): boolean {
        return this._current.hasPrerollShown;
    }

    setPrerollShown(hasShown: boolean): void {
        this._current.hasPrerollShown = hasShown;
    }

    get interstitialId(): string {
        return this._current.interstitialId;
    }

    get rewardedId(): string {
        return this._current.rewardedId;
    }

    /**
     * Fetches the ad unit IDs from Rakuten API.
     * @example Object returned
     *[
     *  {
     *    "id": "someID",
     *    "type": "INTERSTITIAL"
     *  }
     *]
     */
    private _setLinkViberAdUnitIds(): void {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitsAsync().then((adUnits: any[]) => {
                if (adUnits == null || undefined) {
                    console.error("[Wortal] Failed to retrieve ad units.");
                    return;
                }
                for (let i = 0; i < adUnits.length; i++) {
                    if (adUnits[i].type === "INTERSTITIAL") {
                        this._current.interstitialId = adUnits[i].id;
                    } else if (adUnits[i].type === "REWARDED_VIDEO") {
                        this._current.rewardedId = adUnits[i].id;
                    }
                }
                console.log("[Wortal] AdConfig initialized: ", this._current);
            }).catch((e: any) => {
                rethrowPlatformError(e, "setLinkViberAdUnitIds()");
            });
        }
    }

    /**
     * Fetches the ad unit IDs from Wortal API.
     * @example JSON returned
     *{
     *  "gameID": 68,
     *  "ads": [
     *     {
     *      "display_format": "interstitial",
     *      "placement_id": "1284783688986969_1317853085680029"
     *     }
     *   ]
     *}
     */
    private _setFacebookAdUnitIds(): void {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitIDAsync().then((adUnits: any) => {
                if ((adUnits == null || undefined) || (adUnits.ads == null || undefined)) {
                    console.error("[Wortal] Failed to retrieve ad units.");
                    return;
                }
                for (let i = 0; i < adUnits.ads.length; i++) {
                    if (adUnits.ads[i].display_format === "interstitial") {
                        this._current.interstitialId = adUnits.ads[i].placement_id;
                    } else if (adUnits.ads[i].display_format === "rewarded_video") {
                        this._current.rewardedId = adUnits.ads[i].placement_id;
                    }
                }
                console.log("[Wortal] AdConfig initialized: ", this._current);
            }).catch((e: any) => {
                rethrowPlatformError(e, "setFacebookAdUnitIds()");
            });
        }
    }
}
