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
        if (config.session.platform === "link" || config.session.platform === "viber") {
            this.setLinkViberAdUnitIds();
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
