import { API_URL, WORTAL_API } from "../../data/core-data";
import { notSupported } from "../../errors/error-handler";
import { AdsBase } from "../ads-base";
import { AdConfig } from "../classes/ad-config";
import { AdConfigNull } from "../classes/ad-config-null";
import { AdInstanceData } from "../interfaces/ad-data";
import { BannerPosition } from "../types/banner-position";

/**
 * Telegram implementation of the Ads API.
 * @hidden
 */
export class AdsTelegram extends AdsBase {
    //TODO: implement ads for Telegram when available
    protected _adConfig: AdConfig;

    constructor() {
        super();
        this._adConfig = new AdConfigNull();
    }

    protected showBannerImpl(shouldShow: boolean, position: BannerPosition): void {
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_BANNER, API_URL.ADS_SHOW_BANNER);
    }

    protected showInterstitialImpl(ad: AdInstanceData): void {
        ad.callbacks.noFill();
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_INTERSTITIAL, API_URL.ADS_SHOW_INTERSTITIAL);
    }

    protected showRewardedImpl(ad: AdInstanceData): void {
        ad.callbacks.adDismissed?.();
        ad.callbacks.noFill();
        throw notSupported(undefined, WORTAL_API.ADS_SHOW_REWARDED, API_URL.ADS_SHOW_REWARDED);
    }

}
