import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdResult_GamePix } from "../interfaces/gamepix-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * GamePix implementation of the Ads API.
 * @hidden
 */
export class AdsGamePix extends AdsBase {
    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        ad.callbacks.beforeAd();
        Wortal._internalPlatformSDK.interstitialAd()
            .then((result: AdResult_GamePix) => {
                // The docs say to check result.success but this was consistently undefined during testing despite
                // the ad showing successfully.
                if (result) {
                    ad.callbacks.afterAd();
                    Wortal.analytics._logAdCall("interstitial", ad.placementType, true);
                } else {
                    Wortal._log.warn("Ad instance encountered an error or was not filled.");
                    ad.callbacks.noFill();
                    Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
                }
            })
            .catch((error: any) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        ad.callbacks.beforeAd();
        Wortal._internalPlatformSDK.rewardAd()
            .then((result: AdResult_GamePix) => {
                Wortal._log.debug("Rewarded ad result", result);
                if (result.success) {
                    ad.callbacks.adViewed?.();
                    ad.callbacks.afterAd();
                    Wortal.analytics._logAdCall("rewarded", ad.placementType, true, true);
                } else {
                    // A message property is added when there was an error, if undefined it indicates the player dismissed the ad.
                    if (typeof result.message !== "undefined") {
                        Wortal._log.warn("Ad instance encountered an error or was not filled.", result.message);
                        ad.callbacks.noFill();
                        Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
                    } else {
                        Wortal._log.debug("Rewarded ad dismissed by player.");
                        ad.callbacks.adDismissed?.();
                        ad.callbacks.afterAd();
                        Wortal.analytics._logAdCall("rewarded", ad.placementType, true, false);
                    }
                }
            })
            .catch((error: any) => {
                Wortal._log.warn("Ad instance encountered an error or was not filled.", error);
                ad.callbacks.adDismissed?.();
                ad.callbacks.noFill();
                Wortal.analytics._logAdCall("rewarded", ad.placementType, false, false);
            });
    }

}
