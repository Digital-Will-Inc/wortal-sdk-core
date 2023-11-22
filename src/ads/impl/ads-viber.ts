import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { ErrorMessage_Viber } from "../../errors/interfaces/viber-error";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdInstance_Link_Viber } from "../interfaces/rakuten-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * Viber implementation of the Ads API.
 * @hidden
 */
export class AdsViber extends AdsBase {
    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        let preloadedInterstitial: AdInstance_Link_Viber;
        Wortal._internalPlatformSDK.getInterstitialAdAsync(ad.adUnitId)
            .then((interstitial: AdInstance_Link_Viber) => {
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
                    .catch((error: ErrorMessage_Viber) => {
                        Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.noFill();
                        Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
                    });
            })
            .catch((error: ErrorMessage_Viber) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        let preloadedRewardedVideo: AdInstance_Link_Viber;
        Wortal._internalPlatformSDK.getRewardedVideoAsync(ad.adUnitId)
            .then((rewarded: AdInstance_Link_Viber) => {
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
                    .catch((error: ErrorMessage_Viber) => {
                        Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                        ad.callbacks.adDismissed?.();
                        ad.callbacks.noFill();
                        Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
                    });
            })
            .catch((error: ErrorMessage_Viber) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
            });
    }

}
