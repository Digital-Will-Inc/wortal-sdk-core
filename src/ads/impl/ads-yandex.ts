import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdStatus_Yandex } from "../interfaces/yandex-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * Yandex implementation of the Ads API.
 * @hidden
 */
export class AdsYandex extends AdsBase {
    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        Wortal._internalPlatformSDK.adv.getBannerAdvStatus()
            .then((status: AdStatus_Yandex) => {
                if (!status.stickyAdvIsShowing && typeof status.reason !== "undefined") {
                    Wortal._log.exception("Banner ad failed to load.", status.reason);
                    return;
                }

                if (status.stickyAdvIsShowing && !shouldShow) {
                    Wortal._internalPlatformSDK.adv.hideBannerAdv();
                    return;
                }

                if (!status.stickyAdvIsShowing && shouldShow) {
                    Wortal._internalPlatformSDK.adv.showBannerAdv();
                    Wortal.analytics._logAdCall("banner", "pause", true);
                }
            })
            .catch((error: any) => {
                Wortal._log.exception("Ad instance encountered an error or was not filled.", error);
                Wortal.analytics._logAdCall("banner", "pause", false);
            });
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        Wortal._internalPlatformSDK.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => {
                    ad.callbacks.beforeAd();
                },
                onClose: (wasShown: boolean) => {
                    ad.callbacks.afterAd();
                    Wortal.analytics._logAdCall("interstitial", ad.placementType, wasShown);
                },
                onError: (error: unknown) => {
                    ad.callbacks.noFill();
                    Wortal._log.exception("Ad instance encountered an error or was not filled.", error);
                    Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
                },
                onOffline: () => {
                    ad.callbacks.noFill();
                    Wortal._log.warn("Ad instance not shown due to network error. Please check your internet connection.");
                    Wortal.analytics._logAdCall("interstitial", ad.placementType, false);
                }
            }
        });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        Wortal._internalPlatformSDK.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    ad.callbacks.beforeAd();
                },
                onClose: (wasShown: boolean) => {
                    ad.callbacks.afterAd();
                    Wortal.analytics._logAdCall("rewarded", ad.placementType, wasShown);
                },
                onError: (error: unknown) => {
                    ad.callbacks.noFill();
                    ad.callbacks.adDismissed?.();
                    Wortal._log.exception("Ad instance encountered an error or was not filled.", error);
                    Wortal.analytics._logAdCall("rewarded", ad.placementType, false);
                },
                onRewarded: () => {
                    ad.callbacks.adViewed?.();
                }
            }
        });
    }

}
