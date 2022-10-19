import {Ads} from "./ads";
import {Placement} from "./placement";
import {AdUtils} from "./adUtils";
import {Wortal} from "../index";

/**
 * Ads implementation for the Viber platform.
 */
export class ViberAds implements Ads {
    showInterstitial(placement: Placement, description: string, beforeAd: Function, afterAd: Function): void {
        if (!AdUtils.canShow(placement)) return;
        Wortal.isAdShowing = true;
        (window as any).triggerWortalAd(placement, Wortal.data.viberInterstitialId, description, {
            beforeAd: () => {
                Wortal.debug("BeforeAd");
                beforeAd();
            },
            afterAd: () => {
                Wortal.debug("AfterAd");
                afterAd();
                Wortal.isAdShowing = false;
            },
            noBreak: () => {
                Wortal.debug("NoBreak");
                afterAd();
                Wortal.isAdShowing = false;
            },
        });
    }

    showRewarded(description: string, beforeAd: Function, afterAd: Function, adDismissed: Function, adViewed: Function): void {
        if (!AdUtils.canShow(Placement.REWARD, false)) return;
        Wortal.isAdShowing = true;
        (window as any).triggerWortalAd('reward', Wortal.data.viberRewardedId, description, {
            beforeAd: () => {
                Wortal.debug("BeforeAd");
                beforeAd();
            },
            afterAd: () => {
                Wortal.debug("AfterAd");
                afterAd();
                Wortal.isAdShowing = false;
            },
            noBreak: () => {
                Wortal.debug("NoBreak");
                afterAd();
                Wortal.isAdShowing = false;
            },
            adDismissed: () => {
                Wortal.debug("AdDismissed");
                adDismissed();
            },
            adViewed: () => {
                Wortal.debug("AdViewed");
                adViewed();
            },
        });
    }
}
