import {AdConfigData} from "../types/ad-config";
import {sdk} from "../sdk";

/**
 * Configuration settings for ads in the current session.
 */
export default class AdConfig {
    private _current: AdConfigData = {
        isAdBlocked: false,
        hasPrerollShown: false,
        interstitialId: "",
        rewardedId: "",
    };

    /** @hidden */
    constructor() {
        if (sdk.session.platform === "link" || sdk.session.platform === "viber") {
            this.setLinkViberAdUnitIds();
        }
    }

    /**
     * Checks whether the player is using an ad blocker or not.
     * @returns True if ad blocker is used.
     */
    get isAdBlocked(): boolean {
        return this._current.isAdBlocked;
    }

    /**
     * Sets the flag for an ad blocker being present.
     * @param isBlocked True if ad blocker is present.
     */
    setAdBlocked(isBlocked: boolean): void {
        this._current.isAdBlocked = isBlocked;
    }

    /**
     * Has the player been shown a preroll ad or not. This can only occur once per session and needs to happen
     * before the game has loaded.
     * @returns True if the player has been shown a preroll ad.
     */
    get hasPrerollShown(): boolean {
        return this._current.hasPrerollShown;
    }

    /**
     * Sets the flag for a preroll ad having been shown.
     * @param hasShown True if the preroll ad was shown.
     */
    setPrerollShown(hasShown: boolean): void {
        this._current.hasPrerollShown = hasShown;
    }

    /**
     * Gets the interstitial ad unit ID.
     * @returns String ID.
     */
    get interstitialId(): string {
        return this._current.interstitialId;
    }

    /**
     * Gets the rewarded ad unit ID.
     * @returns String ID.
     */
    get rewardedId(): string {
        return this._current.rewardedId;
    }

    private setLinkViberAdUnitIds(): void {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitsAsync().then((adUnits: any[]) => {
                console.log("[Wortal] AdUnit IDs returned: \n" + adUnits[0].id + "\n" + adUnits[1].id);
                this._current.interstitialId = adUnits[0].id;
                this._current.rewardedId = adUnits[1].id;
            });
        }
    }
}
