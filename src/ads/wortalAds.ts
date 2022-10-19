import {Ads} from "./ads";
import {Placement} from "./placement";
import {Wortal} from "../index";
import {AdUtils} from "./adUtils";

/**
 * Ads implementation for the Wortal platform.
 */
export class WortalAds implements Ads {
    showInterstitial(placement: Placement, description: string, beforeAd: Function, afterAd: Function): void {
        if (!AdUtils.canShow(placement)) return;
        Wortal.isAdShowing = true;
        (window as any).triggerWortalAd(placement, "", description, {
            beforeAd: () => {
                Wortal.debug("BeforeAd");
                beforeAd();
            },
            afterAd: () => {
                Wortal.debug("AfterAd");
                afterAd();
                Wortal.isAdShowing = false;
            },
            noShow: () => {
                Wortal.debug("NoShow");
                afterAd();
                Wortal.isAdShowing = false;
            },
            adBreakDone: () => {
                // afterAd isn't fired on pre-rolls so this is the callback we have to use.
                if (placement === Placement.PREROLL) {
                    afterAd();
                }
                Wortal.debug("AdBreakDone");
            }
        });
    }

    showRewarded(description: string, beforeAd: Function, afterAd: Function,
                 adDismissed: Function, adViewed: Function): void {
        if (!AdUtils.canShow(Placement.REWARD, false)) return;
        Wortal.isAdShowing = true;
        (window as any).triggerWortalAd('reward', "", description, {
            beforeAd: () => {
                Wortal.debug("BeforeAd");
                beforeAd();
            },
            afterAd: () => {
                Wortal.debug("AfterAd");
                afterAd();
                Wortal.isAdShowing = false;
            },
            noShow: () => {
                Wortal.debug("NoShow");
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
            beforeReward: (showAdFn: Function) => {
                Wortal.debug("BeforeReward");
                showAdFn();
            },
            adBreakDone: () => {
                Wortal.debug("AdBreakDone");
            }
        });
    }
}
