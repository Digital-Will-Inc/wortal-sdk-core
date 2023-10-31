import { API_URL, GD_GAME_MONETIZE_API, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import Wortal from "../../index";
import { addExternalCallback } from "../../utils/wortal-utils";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { BannerPosition } from "../types/banner-position";

/**
 * GameMonetize implementation of the Ads API.
 * @hidden
 */
export class AdsGameMonetize extends AdsBase {
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

        // GameMonetize uses the showBanner API even though it is an interstitial.
        Wortal._internalPlatformSDK.showBanner();
        this.logAdCall("interstitial", ad.placementType, true);
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        // Trigger the callbacks so the game doesn't get stuck waiting indefinitely.
        ad.callbacks.adDismissed?.();
        ad.callbacks.noFill();
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_REWARDED, API_URL.ADS_SHOW_REWARDED);
    }

}
