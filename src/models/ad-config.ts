import { AdConfigData } from "../types/ad-config";
import { config } from "../api";

/** @hidden */
export default class AdConfig {
    private _current: AdConfigData = {
        isAdBlocked: false,
        hasPrerollShown: false,
        interstitialId: "",
        rewardedId: "",
    };

    constructor() {
        if (config.session.platform === "link") {
            this.setLinkViberAdUnitIds();
        } else if (config.session.platform === "facebook") {
            this.setFacebookAdUnitIds();
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
    private setLinkViberAdUnitIds(): void {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitsAsync().then((adUnits: any[]) => {
                if (adUnits == null || undefined) {
                    console.error("[Wortal] Failed to retrieve ad units.");
                    return;
                }
                console.log("[Wortal] AdUnit IDs returned: \n" + adUnits);
                for (let i = 0; i < adUnits.length; i++) {
                    if (adUnits[i].type === "INTERSTITIAL") {
                        this._current.interstitialId = adUnits[i].id;
                    }
                    else if (adUnits[i].type === "REWARDED_VIDEO") {
                        this._current.rewardedId = adUnits[i].id;
                    }
                }
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
    private setFacebookAdUnitIds(): void {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitIDAsync().then((adUnits: any) => {
                if (adUnits == null || undefined) {
                    console.error("[Wortal] Failed to retrieve ad units.");
                    return;
                }
                if (adUnits.ads == null || undefined) {
                    console.error("[Wortal] Failed to retrieve ad units.");
                    return;
                }
                console.log("[Wortal] AdUnit IDs returned: \n" + adUnits.ads);
                for (let i = 0; i < adUnits.ads.length; i++) {
                    if (adUnits.ads[i].display_format === "interstitial") {
                        this._current.interstitialId = adUnits.ads[i].placement_id;
                    } else if (adUnits.ads[i].display_format === "rewarded") {
                        this._current.rewardedId = adUnits.ads[i].placement_id;
                    }
                }
            })
            .catch((e: any) => {
                throw Error(e);
            });
        }
    }
}
