import { ErrorMessage_Facebook } from "../../errors/interfaces/facebook-error";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdInstance_Facebook } from "../interfaces/facebook-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * Facebook Instant Games implementation of the Ads API.
 * @hidden
 */
export class AdsFacebook extends AdsBase {
    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        Wortal._internalPlatformSDK.loadBannerAdAsync(this._adConfig.bannerId, position)
            .then(() => {
                Wortal.analytics._logAdCall("banner", "pause", true);
            })
            .catch((error: ErrorMessage_Facebook) => {
                Wortal._log.exception("Banner ad failed to load.", error);
                Wortal.analytics._logAdCall("banner", "pause", false);
            });
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        let preloadedInterstitial: AdInstance_Facebook;
        Wortal._internalPlatformSDK.getInterstitialAdAsync(ad.adUnitId)
            .then((interstitial: AdInstance_Facebook) => {
                Wortal._log.debug("Interstitial ad fetched successfully. Attempting to load..", interstitial);
                ad.callbacks.beforeAd();
                preloadedInterstitial = interstitial;
                return preloadedInterstitial.loadAsync();
            })
            .then(() => {
                Wortal._log.debug("Interstitial ad loaded successfully. Attempting to show..");
                preloadedInterstitial.showAsync()
                    .then(() => {
                        Wortal._log.debug("Interstitial ad finished successfully.");
                        ad.callbacks.afterAd();
                        Wortal.analytics._logAdCall("interstitial", ad.placementType, true);
                    })
                    .catch((error: ErrorMessage_Facebook) => {
                        Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.noFill();
                        Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
                    });
            })
            .catch((error: ErrorMessage_Facebook) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        let preloadedRewardedVideo: AdInstance_Facebook;
        Wortal._internalPlatformSDK.getRewardedVideoAsync(ad.adUnitId)
            .then((rewarded: AdInstance_Facebook) => {
                Wortal._log.debug("Rewarded video fetched successfully. Attempting to load..", rewarded);
                ad.callbacks.beforeAd();
                preloadedRewardedVideo = rewarded;
                return preloadedRewardedVideo.loadAsync();
            })
            .then(() => {
                Wortal._log.debug("Rewarded video loaded successfully. Attempting to show..");
                preloadedRewardedVideo.showAsync()
                    .then(() => {
                        Wortal._log.debug("Rewarded video watched successfully");
                        ad.callbacks.adViewed?.();
                        ad.callbacks.afterAd();
                        Wortal.analytics._logAdCall("rewarded", ad.placementType, true, true);
                    })
                    .catch((error: ErrorMessage_Facebook) => {
                        Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.adDismissed?.();
                        ad.callbacks.noFill();
                        Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
                    });
            })
            .catch((error: ErrorMessage_Facebook) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
            });
    }
}
