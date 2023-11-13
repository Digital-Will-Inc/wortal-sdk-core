import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { BannerPosition } from "../types/banner-position";

/**
 * Poki implementation of the Ads API.
 * @hidden
 */
export class AdsPoki extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        Wortal._internalPlatformSDK.commercialBreak(ad.callbacks.beforeAd)
            .then(() => {
                ad.callbacks.afterAd();
                this.logAdCall("interstitial", ad.placementType, true);
            })
            .catch(() => {
                ad.callbacks.noFill();
                this.logAdCall("interstitial", ad.placementType, false);
            });
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        Wortal._internalPlatformSDK.rewardedBreak(ad.callbacks.beforeAd)
            .then((rewarded: boolean) => {
                if (rewarded) {
                    ad.callbacks.adViewed?.();
                } else {
                    ad.callbacks.adDismissed?.();
                }

                ad.callbacks.afterAd();
                this.logAdCall("rewarded", ad.placementType, rewarded);
            })
            .catch(() => {
                ad.callbacks.adDismissed?.();
                ad.callbacks.noFill();
                this.logAdCall("rewarded", ad.placementType, false);
            });
    }

}
