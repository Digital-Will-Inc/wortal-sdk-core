import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { debug, exception, warn } from "../../utils/logger";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigFacebook } from "../classes/ad-config-facebook";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdInstance_Facebook } from "../interfaces/facebook-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * Facebook Instant Games implementation of the Ads API.
 * @hidden
 */
export class AdsFacebook extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigFacebook();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        Wortal._internalPlatformSDK.loadBannerAdAsync(this._adConfig.bannerId, position)
            .then(() => {
                this.logAdCall("banner", "pause", true);
            })
            .catch((error: ErrorMessage_Facebook) => {
                exception("Banner ad failed to load.", error);
                this.logAdCall("banner", "pause", false);
            });
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        let preloadedInterstitial: AdInstance_Facebook;
        Wortal._internalPlatformSDK.getInterstitialAdAsync(ad.adUnitId)
            .then((interstitial: AdInstance_Facebook) => {
                debug("Interstitial ad fetched successfully. Attempting to load..", interstitial);
                ad.callbacks.beforeAd();
                preloadedInterstitial = interstitial;
                return preloadedInterstitial.loadAsync();
            })
            .then(() => {
                debug("Interstitial ad loaded successfully. Attempting to show..");
                preloadedInterstitial.showAsync()
                    .then(() => {
                        debug("Interstitial ad finished successfully.");
                        ad.callbacks.afterAd();
                        this.logAdCall("interstitial", ad.placementType, true);
                    })
                    .catch((error: ErrorMessage_Facebook) => {
                        warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.noFill();
                        this.logAdCall("interstitial", ad.placementType, false);
                    });
            })
            .catch((error: ErrorMessage_Facebook) => {
                warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                this.logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        let preloadedRewardedVideo: AdInstance_Facebook;
        Wortal._internalPlatformSDK.getRewardedVideoAsync(ad.adUnitId)
            .then((rewarded: AdInstance_Facebook) => {
                debug("Rewarded video fetched successfully. Attempting to load..", rewarded);
                ad.callbacks.beforeAd();
                preloadedRewardedVideo = rewarded;
                return preloadedRewardedVideo.loadAsync();
            })
            .then(() => {
                debug("Rewarded video loaded successfully. Attempting to show..");
                preloadedRewardedVideo.showAsync()
                    .then(() => {
                        debug("Rewarded video watched successfully");
                        ad.callbacks.adViewed?.();
                        ad.callbacks.afterAd();
                        this.logAdCall("rewarded", ad.placementType, true, true);
                    })
                    .catch((error: ErrorMessage_Facebook) => {
                        warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.adDismissed?.();
                        ad.callbacks.noFill();
                        this.logAdCall("rewarded", ad.placementType, false, false);
                    });
            })
            .catch((error: ErrorMessage_Facebook) => {
                warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                this.logAdCall("rewarded", ad.placementType, false, false);
            });
    }
}
