import {Ads} from "./ads";
import {Placement} from "./placement";
import {Wortal} from "../index";

/**
 * Ads implementation for debugging the SDK. Does not call the Wortal backend.
 */
export class DebugAds implements Ads {
    private _adCounter: number = 0;

    showInterstitial(placement: Placement, description: string, beforeAd: Function, afterAd: Function): void {
        Wortal.log("Simulating interstitial ad call..");
        Wortal.log("Ad: " + placement + " / " + description);
        beforeAd();
        Wortal.log("Ad finishing in 2 seconds..");
        setTimeout(() => afterAd(), 2000);
    }

    showRewarded(description: string, beforeAd: Function, afterAd: Function, adDismissed: Function, adViewed: Function): void {
        // Alternates every ad call between firing adDismissed and adViewed to allow for testing both callbacks.
        this._adCounter++;
        Wortal.log("Simulating rewarded ad call..");
        Wortal.log("Ad: " + description);
        beforeAd();
        Wortal.log("Ad finishing in 2 seconds..");
        setTimeout(() => afterAd(), 2000);
        if (this._adCounter % 2 === 0) {
            adDismissed();
        } else {
            adViewed();
        }
    }
}
