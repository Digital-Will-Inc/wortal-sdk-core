import Wortal from "../../index";
import { exception, warn } from "../../utils/logger";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { AdStatus_Yandex } from "../interfaces/yandex-ads";
import { BannerPosition } from "../types/banner-position";

/**
 * Yandex implementation of the Ads API.
 * @hidden
 */
export class AdsYandex extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        Wortal._internalPlatformSDK.adv.getBannerAdvStatus()
            .then((status: AdStatus_Yandex) => {
                if (!status.stickyAdvIsShowing && typeof status.reason !== "undefined") {
                    exception("Banner ad failed to load.", status.reason);
                    return;
                }

                if (status.stickyAdvIsShowing && !shouldShow) {
                    Wortal._internalPlatformSDK.adv.hideBannerAdv();
                    return;
                }

                if (!status.stickyAdvIsShowing && shouldShow) {
                    Wortal._internalPlatformSDK.adv.showBannerAdv();
                    this.logAdCall("banner", "pause", true);
                }
            })
            .catch((error: any) => {
                exception("Ad instance encountered an error or was not filled.", error);
                this.logAdCall("banner", "pause", false);
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
                    this.logAdCall("interstitial", ad.placementType, wasShown);
                },
                onError: (error: unknown) => {
                    ad.callbacks.noFill();
                    exception("Ad instance encountered an error or was not filled.", error);
                    this.logAdCall("interstitial", ad.placementType, false);
                },
                onOffline: () => {
                    ad.callbacks.noFill();
                    warn("Ad instance not shown due to network error. Please check your internet connection.");
                    this.logAdCall("interstitial", ad.placementType, false);
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
                    this.logAdCall("rewarded", ad.placementType, wasShown);
                },
                onError: (error: unknown) => {
                    ad.callbacks.noFill();
                    ad.callbacks.adDismissed?.();
                    exception("Ad instance encountered an error or was not filled.", error);
                    this.logAdCall("rewarded", ad.placementType, false);
                },
                onRewarded: () => {
                    ad.callbacks.adViewed?.();
                }
            }
        });
    }

}
