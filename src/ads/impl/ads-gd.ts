import { API_URL, GD_GAME_MONETIZE_API, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { warn } from "../../utils/logger";
import { addExternalCallback } from "../../utils/wortal-utils";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { BannerPosition } from "../types/banner-position";

/**
 * Game Distribution implementation of the Ads API.
 * @hidden
 */
export class AdsGD extends AdsBase {
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        addExternalCallback(GD_GAME_MONETIZE_API.BEFORE_AD, ad.callbacks.beforeAd);
        addExternalCallback(GD_GAME_MONETIZE_API.AFTER_AD, ad.callbacks.afterAd);
        addExternalCallback(GD_GAME_MONETIZE_API.NO_FILL, ad.callbacks.noFill);

        Wortal._internalPlatformSDK.showAd("interstitial");
        this.logAdCall("interstitial", ad.placementType, true);
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        addExternalCallback(GD_GAME_MONETIZE_API.BEFORE_AD, ad.callbacks.beforeAd);
        addExternalCallback(GD_GAME_MONETIZE_API.AFTER_AD, ad.callbacks.afterAd);
        addExternalCallback(GD_GAME_MONETIZE_API.NO_FILL, ad.callbacks.noFill);
        // These are validated in AdsBase.
        addExternalCallback(GD_GAME_MONETIZE_API.AD_DISMISSED, ad.callbacks.adDismissed!);
        addExternalCallback(GD_GAME_MONETIZE_API.AD_VIEWED, ad.callbacks.adViewed!);

        Wortal._internalPlatformSDK.preloadAd("rewarded")
            .then(() => {
                Wortal._internalPlatformSDK.showAd("rewarded")
                    .then(() => {
                        this.logAdCall("rewarded", ad.placementType, true, true);
                    })
                    .catch((error: any) => {
                        warn("Ad instance encountered an error or was not filled.", error);
                        this.logAdCall("rewarded", ad.placementType, false, false);
                    });
            })
            .catch((error: any) => {
                warn("Ad instance encountered an error or was not filled.", error);
                this.logAdCall("rewarded", ad.placementType, false, false);
            });
    }

}
