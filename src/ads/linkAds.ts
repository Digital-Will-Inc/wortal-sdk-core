import {Ads} from "./ads";
import {Wortal} from "../index";
import {Placement} from "./placement";
import {AdUtils} from "./adUtils";

/**
 * Ads implementation for the Link platform.
 */
export class LinkAds implements Ads {
    constructor() {
        if ((window as any).wortalGame) {
            (window as any).wortalGame.getAdUnitsAsync().then((adUnits: any[]) => {
                Wortal.log("Link AdUnit IDs returned: \n" + adUnits[0].id + "\n" + adUnits[1].id);
                Wortal.data.linkInterstitialId = adUnits[0].id;
                Wortal.data.linkRewardedId = adUnits[1].id;
            });
        }
    }

    showInterstitial(placement: Placement, description: string, beforeAd: Function, afterAd: Function): void {
        if (!AdUtils.canShow(placement)) return;
        Wortal.isAdShowing = true;
        (window as any).triggerWortalAd(placement, Wortal.data.linkInterstitialId, description, {
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
        (window as any).triggerWortalAd('reward', Wortal.data.linkRewardedId, description, {
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
